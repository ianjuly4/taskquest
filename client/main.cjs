const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  hardResetMethod: 'exit'
});

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = 460;
  const winHeight = 1050;

  const x = screenWidth - winWidth;
  const y = 0; 

  const win = new BrowserWindow({
    x,
    y,
    width: winWidth,
    height: winHeight,
    resizable: true,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.setMenuBarVisibility(false); 

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' }); 
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
