import { VIDEO_PATH } from "./constant"
const path = require('path')
const http =require('http')
const url =require('url')
const fs =require('fs')

export const httpServer = () =>{
  const server = http.createServer((req,res)=>{
    const pathName = req.url
    const realPath = path.join(VIDEO_PATH,pathName)
    fs.readFile(realPath,(err,data)=>{
      if(err){
        res.writeHead(404,{
          'Content-Type': 'text/plain;charset=utf-8'
        })
        res.write('404')
        res.end()
      }else{
        res.writeHead(200,{
          'Content-Type': Buffer.byteLength(data)
        })
        res.write(data)
        res.end()
      }
    })
  })

  // 监听端口
  server.listen(6060,()=>{
    console.log('服务器启动了');
  })
}