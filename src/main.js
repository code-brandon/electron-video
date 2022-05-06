import { createApp } from 'vue'
import App from './App.vue'
import Directive from './directives'
import router from './router'
import svgIcon from '@/components/svgIcon'
// import { ipcRenderer } from 'electron';
// const { ipcRenderer } = window.require('electron')

import './assets/icons' // icon

const app = createApp(App)

app.component('svg-icon',svgIcon)

// vue2 写法
// app.prototype.$ipcRenderer = ipcRenderer

// vue3 写法，取的时候要引入 import { ipcRenderer } from "vue" vue3中在setup里面我们都获取不到this
// app.config.globalProperties.$ipcRenderer = ipcRenderer

// 注册指令
app.use(router).use(Directive).mount('#app')
