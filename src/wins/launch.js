// 启动页
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { BrowserWindow } from "electron";

// 事件使用
const events = require('events')

const windConfig = {
  show:false,
  frame:false,
  focusable:true,
  resizable:false,
  webPreferences:{
    // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    nodeIntegration: true,
    contextIsolation: false
  }
}

class Launch extends events{
 constructor(confInfo){
   super()
   this.confInfo = confInfo
   this.conf = Object.assign({},windConfig,confInfo)
   this.windowInstance = new BrowserWindow(this.conf)

   if(process.env.WEBPACK_DEV_SERVER_URL){
    this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/launch`)
   }else{
     createProtocol('app')
     this.windowInstance.loadURL('app://./index.html/#/launch')
   }

   this.init()
 }

 init(){
   this.windowInstance.once('ready-to-show',()=>{
     this.windowInstance.show()
   })

   this.windowInstance.on('show',()=>{
     this.emit('show')
   })
 }

 close(){
   if(this.windowInstance && this.windowInstance.isVisible){
    console.log('启动页关闭');
    this.windowInstance.close()
    this.windowInstance = null
   }
 }
}

export default Launch