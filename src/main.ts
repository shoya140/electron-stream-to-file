import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

const LOG_DIRECTORY_NAME = 'electron-stream-to-file'
const STREAM_FILE_NAME = 'sensor.csv'
const LABEL_FILE_NAME = 'label.csv'

let mainWindow: Electron.BrowserWindow
let logDirectory: string

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    minWidth: 400,
    height: 300,
    minHeight: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
  }
}

app.on('ready', () => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('start-streaming', (event: IpcMainEvent, timeString: string) => {
  logDirectory = path.join(app.getPath('home'), LOG_DIRECTORY_NAME, timeString)
  fs.mkdirSync(logDirectory, { recursive: true })
  fs.writeFileSync(
    path.join(logDirectory, STREAM_FILE_NAME),
    '#timestamp,data\n'
  )
  fs.writeFileSync(
    path.join(logDirectory, LABEL_FILE_NAME),
    '#timestamp,label\n'
  )
})

ipcMain.on(
  'write-stream',
  (event: IpcMainEvent, timestamp: string, data: string) => {
    fs.appendFileSync(
      path.join(logDirectory, STREAM_FILE_NAME),
      `${timestamp},${data}\n`
    )
  }
)

ipcMain.on(
  'write-label',
  (event: IpcMainEvent, timestamp: string, label: string) => {
    fs.appendFileSync(
      path.join(logDirectory, LABEL_FILE_NAME),
      `${timestamp},${label}\n`
    )
  }
)
