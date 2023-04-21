## electron
一个开源的跨平台的web框架，可以快速开发跨平台桌面应用，基于chromium和nodejs

github有一个electron-vite-vue项目，可以迅速搭建好一个环境，在此基础上稍微调整了一下就可以使用了

---
### 进程

多进程：有一个主进程和多个渲染器进程，开发的页面就是渲染进程，主进程可以做很多事情，控制原生桌面功能的模块，与操作系统交互等等

出于安全考虑，防止恶意代码使用nodejs操作本地文件或者执行命令，渲染进程默认禁用集成nodejs(nodeIntegration)，以及上下文隔离(contextIsolation)  

---

### preload预加载脚本
运行于渲染器进程页面渲染之前，可以使用nodejs，与页面共用一个window对象，但是上下文隔离后，就不能共用同一个window了，此时只能使用contextBridge暴露给渲染器进程部分nodejs功能，或者进程之间通信功能

``` js
// preload
import { contextBridge } from 'electron'
contextBridge.exposeInMainWorld('xxxApi', any)
// rederer.js
window.xxxApi
```  

---

### 进程间通信 IPC模块
主进程和渲染进程之间是可以通信的，通过ipcMain和ipcRenderer，但是由于上下文隔离，渲染进程不能导入ipcRenderer，所以由preload脚本通过contextBridge暴露一些安全的、有校验功能的接口。
[mainjs 108](./electron/main/index.ts)

#### 三种通信方式
|发送|接收|返回消息方式|
|-|-|-|
|send|on|e.reply('name', msg)|
|sendSync|on|e.returnValue|
|invoke|handle|return|
```js

ipcMain.send('channel', {})

ipcRenderer.on('channel', (e) => {
  e.reply('channel2', msg)
})

```

### 沙盒

渲染器进程沙盒模式

### 消息端口
