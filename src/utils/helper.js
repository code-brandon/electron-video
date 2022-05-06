import { VIDEO_PATH } from "./constant"
const path = window.require('path')
const fs = window.require('fs')

export const saveVideo = (blob)=>{

  return new Promise((resolve,reject)=>{
    // 获取时间戳
    const times = new Date().getTime()
    mkdirDirectory(VIDEO_PATH).then((res)=>{
      // console.log(res);
      const videoPath = path.join(VIDEO_PATH,`${times}.mp4`)
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob);
      reader.onload = () =>{
        const buffer = Buffer.from(reader.result)
        fs.writeFile(videoPath,buffer,{},(err,res)=>{
          if(err){
            return
          }
        })
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.onloadend = ()=>{
        resolve()
      }
    })
  })
}

const mkdirDirectory = (pathUrl)=>{

  return new Promise((resolve)=>{
    if(!fs.existsSync(pathUrl)){
      let res = fs.mkdirSync(pathUrl,{
        // 深度创建
        recursive:true
      })

      // 创建失败
      if(!res){
        // 返回失败
        resolve(false)
      }
    }
    // 返回成功
    resolve(true)

  })
}

export const directoryFiles = () => {
  if(!fs.existsSync(VIDEO_PATH)){
    return []
  }
  const filenames = fs.readdirSync(VIDEO_PATH)
  const files = filenames.filter(item => {
    const filepath = path.join(VIDEO_PATH,item)
    return fs.statSync(filepath).isFile()
  })
  return files
}

export const timeFormat = (time) => {
  const h = Math.floor(time/3600) < 10 ? '0'+Math.floor(time/3600) : Math.floor(time/3600)
  const m = Math.floor((time / 60) % 60) < 10 ? '0'+Math.floor((time / 60) % 60) : Math.floor((time / 60) % 60)
  const s = Math.floor(time % 60) < 10 ? '0'+Math.floor(time % 60) : Math.floor(time % 60)

  return `${h}:${m}:${s}`
}