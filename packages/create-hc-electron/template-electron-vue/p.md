# electron

Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。

使用chromium和nodejs

拥有主进程(唯一)和渲染进程(一个或多个进程)

主进程BrowserWindow管理窗口、app操作应用程序

预加载脚本：和渲染进程公用window且可以使用node，但是由于上下文隔离，在window上添加额外信息后，渲染进程不能使用。

安全策略上下文隔离，渲染进程禁用node，沙盒

上下文隔离：预加载脚本暴露一些api到渲染进程，使渲染进程能使用node，
``` ts
contextBridge.exposeInMainWorld('key', {})
window.key
```
进程间通信：IPC，ipcRenderer ipcMain
ipcMain只能on监听事件，任意渲染进程都可以触发事件
不能send或者invoke是因为渲染进程是未知的，可能多个，所以使用win.webContents.send()发送到对应的渲染进程中
``` ts
ipcMain.handle('event', () => {
  return 'ret' // 通过return回复
})
icpRenderer.invoke('event', args);


ipcMain.on('e', (event, args) => {
  e.reply('event', repplyArgs) // 通过e.reply回复
})
ipcRenderer.send('e', args)


ipcMain.on('e', (e) => {
  e.returnValue = 'ret' // 通过returnValue回复
})
ipcRenderer.sendSycn('e', args)

// 主进程到-renderer进程
win.webContents.send('e', args) // 主进程主动发送

```

## 系统相关
菜单Menu

系统托盘Tray

通知Notifications

进度条 progressbar

角标数量 app.setBadgeCount(10)

dialog

自定义窗口

多个窗口

...

# vite electron插件

## vite-plugin-electron
两个作用

1：将main文件和preload的ts文件打包成js文件(commonjs，electron目前版本不支持esm，预计28版本支持)，这样主进程和预加载文件支持ts(包括esm)且不需要手动编译成js，

此过程依赖于vite的build方法

2：开发环境启动项目时同时启动electron .,同时在项目关闭时关闭electron应用，electron应用关闭时关闭项目。

此过程使用node的子进程的spawn方法执行脚本

## vite-plugin-electorn-renderer
主要是在渲染进程中用esm方式使用node和electron以及其他commonjs的包，

因为node和electron只能用commonjs方式，require导入后没有类型提示。

也可以配置其他npm包

``` ts
renderer({
  resolve: {
    mqtt: {
      type: 'cjs'
    }
  }
})

// renderer
import mqtt from 'mqtt'
mqtt.connect("")

```
实现原理：用alias代理node或者electron或者其他手动配置的库，生成mjs文件(目录为node_modules/.vite-electron-renderer/xx.mjs)，文件内容是将commonjs的包一一引入然后esm方式导出，然后就能直接使用了。


# electron-builder
跨平台打包工具 windows linux mac 也支持不同架构


配置文件支持 package.json、 json5、yml、toml、js


# 缺点
文件体积大 至少有100M

占用内存

不支持移动端

桌面应用的一些复杂功能比较难实现
# 优势
前端开发就可以写应用

可以集成node后端

nodejs api