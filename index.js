const { writeFileSync, mkdirSync, existsSync } = require("fs")
const { resolve } = require("path")
const { get } = require("https")

//=========================================== 配置项 ===========================================
let PATH        = "/docs/iview/"                                    //本地浏览的路径，如果是根目录部署，可以填写 空 或者 /
let HOST        = "https://file.iviewui.com/dist/"                  //iview 资源地址
let DIR         = "dist"                                            //下载内容保存目录
let CHUNK_REG   = /n.e\((\d+)\)/g                                   //子模块匹配正则表达式
let MEDIA       = true                                              //是否下载多媒体资源
let MEDIA_REG   = /\w{32}\.(png|svg|jpg|jpeg|gif|woff|woff2|ttf)/g  //图片、字体匹配正则表达式
//=========================================== 配置项 ===========================================

let UUID        = ""
let medias      = new Set()

function load(url, replace, fileName, text=true) {
    return new Promise((ok, fail)=>{
        get(url, res=>{
            let html = ""
    
            if(!text) res.setEncoding("binary")
            res.on('data',  d=> html += text?d.toString():d)
            res.on('end',   ()=> {
                if(replace === true)    html = html.replaceAll(HOST, PATH)
                else if(typeof(replace) == 'object'){
                    Object.keys(replace).forEach(k=> html = html.replaceAll(k, replace[k]))
                }

                if(!!fileName){
                    writeFileSync(resolve(DIR, fileName), html,{encoding: text?"utf-8":"binary"})
                }
                console.log(res.statusCode, url)
                ok(html)
            })
            res.on('error', e=> {
                console.error(`下载${url}出错：`, e)
                fail(e)
            })
        })
    })
}

async function loadChunks(uuid){
    let main = `main.${uuid}.js`
    let html = await load(`${HOST}${main}`, {'"history"':`= "history",z.base="${PATH}"`}, main)
    let chunks = new Set()
    html.replace(CHUNK_REG, (_, v)=> chunks.add(`${v}.${UUID}.chunk.js`))
    return chunks
}

function start(){
    if(DIR && !existsSync(DIR)) mkdirSync(DIR)

    load("https://www.iviewui.com", true, "index.html").then(async html=> {
        //获取 UUID
        UUID = html.match(/vendors.(\w{20}).js/)[1]
        load(`${HOST}vendors.${UUID}.js`, true, `vendors.${UUID}.js`)

        let sources = new Set()
        //解析 MAIN 资源获取全部的路由 chunk
        let mainTxt = await load(`${HOST}main.${UUID}.js`, {'"history"':`= "history",z.base="${PATH}"`}, `main.${UUID}.js`)
        mainTxt.replace(CHUNK_REG, (_, v)=> sources.add(`${v}.${UUID}.chunk.js`))

        sources.add(`main.${UUID}.css`)
        for (const v of sources){
            load(`${HOST}${v}`, true, v).then(txt=>{
                if(MEDIA){
                    let pics = txt.match(MEDIA_REG)
                    if(pics && pics.length>0){
                        pics.forEach(p=> {
                            if(medias.has(p)) return
                            medias.add(p)

                            load(`${HOST}${p}`, false, p, false)
                        })
                    }
                }
            })
        }
    })
}

start()