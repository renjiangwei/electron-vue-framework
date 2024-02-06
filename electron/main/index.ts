import { app, BrowserWindow, shell, ipcMain, Notification, Tray, nativeImage, Menu, MenuItemConstructorOptions,
  dialog, screen
} from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { startServer } from './server'
import { autoUpdater } from 'electron-updater'


if (process.env.NODE_ENV == 'development') {
  console.log('d')
  Object.defineProperty(app, 'isPackaged', {
    get() {
      return true
    }
  })
  autoUpdater.updateConfigPath = join(__dirname, '../../dev-app-update.yml')
}
try {
  autoUpdater.setFeedURL('http://192.168.131.16:8888/')
  autoUpdater.checkForUpdates();
  autoUpdater.addListener('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  })
} catch (e) {

}
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
console.log(process.env.VITE_DEV_SERVER_URL, 'd')
async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false,
    fullscreen: false,
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      // sandbox: true
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
  // win.loadURL('http://192.168.131.16:8080/')

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })


  // const NOTIFICATION_TITLE = 'Basic Notification'
  // const NOTIFICATION_BODY = 'Notification from the Main process'

  // new Notification({
  //   title: NOTIFICATION_TITLE,
  //   body: NOTIFICATION_BODY
  // }).show()

  startServer()
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

const createDialog = () => {
  dialog.showMessageBox({
    message: 'message',
  })
}

let sub: BrowserWindow;
const createSubWindow = () => {
  const p = screen.getPrimaryDisplay()
  const w = p.workAreaSize.width
  const h = p.workAreaSize.height
  if (sub) {
    sub.close()
    sub = null
  }
  sub = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    fullscreen: false,
    title: '通知',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  sub.setPosition(w - 400, h - 400)
  // sub.loadFile('./dist/index.html')
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    sub.loadURL(url + '/subWindow/')
    // Open devTool if the app is not packaged
    // sub.webContents.openDevTools()
  } else {
    sub.loadFile(join(process.env.DIST, 'subWindow/index.html'))
  }
}

let tray: Tray;
const initTray = () => {
  const icon = nativeImage.createFromPath(join(process.env.PUBLIC, 'favicon@256x256.png'))
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'show', type: 'normal', click () {
      win?.show()
    } },
    { label: 'hide', type: 'normal', click () {
      win?.hide()
    } },
    { label: 'max', type: 'normal', click () {
      if (win?.isMaximizable() && !win.isMaximized()) {
        win?.maximize()
      } else {
        win?.unmaximize()
      }
    } },
    { label: 'small', type: 'normal', click () {
      // win.hide()
      win.minimize()
    } },
    { label: 'close', type: 'normal', click () {
      app.quit()
    } }
  ] as MenuItemConstructorOptions[])
  
  tray.setContextMenu(contextMenu)
  tray.setToolTip('This is my application')
  tray.setTitle('This is my title')
  tray.on('double-click', () => {
    if (win?.isMaximizable() && !win.isMaximized()) {
      win?.maximize()
    } else {
      win?.unmaximize()
    }
  })
}

app.whenReady().then(async () => {
  await createWindow();
  initTray()
  let a = 0
  setInterval(() => {
    if (a < 1) {
      win.setProgressBar(a)
      a+=0.03
    } else {
      win.setProgressBar(0)
    }
  }, 1000)
  
  setTimeout(() => {
    createDialog()
  }, 3000)
})

app.on('window-all-closed', () => {
  tray = null
  win = null
  sub = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
// handle invoke return 返回内容
// on send e.reply('name', arg) 返回内容
// on sendSync e.returnValue 返回内容
ipcMain.handle('open-win', (_, arg) => {
  console.log('open-win')
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.handle('show-dialog', (e, msg) => {
  console.log('show dialog', msg)
  createSubWindow()
})
ipcMain.handle('close-dialog', () => {
  sub.close()
  sub = null
})