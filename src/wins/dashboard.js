// 主页面
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { app, BrowserWindow, ipcMain, Tray } from "electron";
// 事件使用
const events = require('events')

const windConfig = {
  title:'录屏客户端',
  show:false,
  frame:false,
  focusable:true,
  resizable:false,
  webPreferences:{
    nodeIntegration: true,
    contextIsolation: false
  }
}

class Dashboard extends events{
  constructor(confInfo){
    super()
    this.confInfo = confInfo
    this.conf = Object.assign({},windConfig,confInfo)
    this.windowInstance = new BrowserWindow(this.conf)
 
    if(process.env.WEBPACK_DEV_SERVER_URL){
     this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/dashboard`)
    }else{
      createProtocol('app')
      this.windowInstance.loadURL('app://./index.html/#/dashboard')
    }

    /* // 开发环境打开开发工具
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      if (!process.env.IS_TEST) this.windowInstance.webContents.openDevTools()
    } */
 
    this.init()
  }
 
  init(){
    this.windowInstance.once('ready-to-show',()=>{
      this.windowInstance.show()
    })
 
    this.windowInstance.on('show',()=>{
      this.emit('show')
    })

    // 初始化时调用通信
    this.listenIpc()
  }
 
  // 进程通信
  listenIpc() {
    // 最小化
    ipcMain.on('mainwin-minize',()=>{
      this.windowInstance.minimize()
    })

    // 最大化
    ipcMain.on('mainwin-maximize',()=>{
      this.windowInstance.maximize()
    })

    // 最大化还原
    ipcMain.on('mainwin-restore',()=>{
      this.windowInstance.restore()
    })

    // 关闭窗口
    ipcMain.on('mainwin-close',()=>{
      app.quit()
    })

    // 渲染进程窗口移动
    ipcMain.on('move-main',(event,pos)=>{
      // console.log(pos);
      this.windowInstance&&this.windowInstance.setPosition(pos.X,pos.Y)
    })
  }
}

export default Dashboard