'use strict'
/**
 * electron 主进程
 */
import { app,screen,Tray,Menu,ipcMain,desktopCapturer, shell} from 'electron'
import Launch from './wins/launch'
import {
  BASE_WIN_HEIGH,
  BASE_WIN_WIDTH,
  DESIGNE_LAUNCH_HEIGH,
  DESIGNE_LAUNCH_WIDTH,
  DESIGNE_DASHBOARD_HEIGH,
  DESIGNE_DASHBOARD_WIDTH,
  VIDEO_PATH
} from './utils/constant'
import Dashboard from './wins/dashboard'
import { httpServer } from './utils/server'
const path = require('path')

const getSize = ()=>{
  const {size,scaleFactor} = screen.getPrimaryDisplay();
  return {
    width:size.width * scaleFactor,
    height:size.height * scaleFactor
  }
}

app.on('ready', async () => {
  const rect = screen.getPrimaryDisplay().bounds

  const launcW = (rect.width / BASE_WIN_WIDTH) * DESIGNE_LAUNCH_WIDTH;
  const launcH = (rect.height / BASE_WIN_HEIGH) * DESIGNE_LAUNCH_HEIGH;

  const dashW = (rect.width / BASE_WIN_WIDTH) * DESIGNE_DASHBOARD_WIDTH;
  const dashH = (rect.height / BASE_WIN_HEIGH) * DESIGNE_DASHBOARD_HEIGH;

  // Create the browser window.
  const launch = new Launch({
    width: launcW,
    height: launcH
  })

  launch.on('show',()=>{
    console.log('启动页启动');
    httpServer()
    // 创建主窗口
    setTimeout(() => {
      const dashboard = new Dashboard({
        width: dashW,
        height: dashH,
        maxWidth : BASE_WIN_WIDTH,
        maxHeight : BASE_WIN_HEIGH
      })
  
      dashboard.on('show',() => {
        console.log('主页启动');
        // 主窗体显示，关闭启动页
        launch.close()
        
        console.log(path.join(__dirname));
        // console.log(__dirname);
       const tray = new Tray(path.join(__dirname, process.env.WEBPACK_DEV_SERVER_URL?'../public/video.png':'./video.png'))
       tray.setToolTip('小政录屏')

       const menu = Menu.buildFromTemplate([
         {
           label: '退出',
           click:()=>{
             console.log('托盘菜单点击了退出！');
             app.quit();
           },
         },
         {
          label: '开发工具',
          click:()=>{
            console.log('托盘菜单点击了开发工具！');
            dashboard.windowInstance.webContents.openDevTools()
          },
        }
       ])

       tray.setContextMenu(menu)
      })

    }, 2000)

  

    /* const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/dashboard`)
      if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      win.loadURL('app://./index.html#/dashboard')
    }

    win.on('ready-to-show',()=>{
      console.log('主窗体显示');
      // 主窗体显示，关闭启动页
      launch.close()
    }) */


    

  })

})


// 渲染进程请求录屏资源
ipcMain.on('recive-dasktop',async (event)=>{
  const sizeInfo = getSize()
  const source = await desktopCapturer.getSources({
    types:['window','screen'],
    thumbnailSize:sizeInfo,
    fetchWindowIcons:true
  });
  console.log(new Date);
  // 回复给渲染进程 dashboard.vue
  event.reply('reply-source',source)

})


ipcMain.on('dir-open',(event,data)=>{
  const file = path.join(VIDEO_PATH,data);
  shell.showItemInFolder(file)
})
