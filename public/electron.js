const { launchVanilla } = require("./launcher/vanilla");
const { launchCustomVersion } = require("./launcher/customVersion");
const { loginWithCredentials, refreshToken, logout } = require("./auth/login");
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const { getSystemMemory } = require('./utils/osUtils');
const { setMemoryRange, getMemoryRange, storeSet, storeGet, customJrePrompt } = require('./config/config');
const { fetchVersions, fetchVanillaList } = require('./launcher/fetchVersions');
const { fetchNews } = require("./news/fetchNews");
const { autoUpdater } = require("electron-updater");

let mainWindow;

const createWindow = () => {
    
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
        },
        frame: isDev,
        icon: path.join(__dirname, "icon.png")
    });

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.on('update-available', info => mainWindow.webContents.send("fwlUpdateAvailable", info.version));
    autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall(false, true));

    ipcMain.handle('fwlLogin', (_, username, password, saveCreds) => loginWithCredentials(username, password, saveCreds));
    ipcMain.handle('fwlRefreshToken', _ => refreshToken());
    ipcMain.handle('fwlLogout', _ => logout());
    ipcMain.handle('fwlGetSystemMemory', _ => getSystemMemory());
    ipcMain.handle('fwlGetMemoryRange', _ => getMemoryRange());
    ipcMain.handle('fwlLaunchCv', (_, auth, id) => launchCustomVersion(auth, id).then(() => mainWindow.close()));
    ipcMain.handle('fwlLaunch', (_, auth, version) => launchVanilla(auth, version).then(() => mainWindow.close()));
    ipcMain.handle('fwlFetchVersions', _ => fetchVersions());
    ipcMain.handle('fwlFetchVanillaList', _ => fetchVanillaList());
    ipcMain.handle('fwlFetchNews', _ => fetchNews());
    ipcMain.handle('fwlStoreGet', (_, key, def) => storeGet(key, def));
    ipcMain.handle('fwlJreCustomPath', _ => customJrePrompt());
    
    ipcMain.on('fwlDownloadAndInstallUpdate', _ => autoUpdater.downloadUpdate());
    ipcMain.on('fwlStoreSet', (_, key,value) => storeSet(key, value));
    ipcMain.on('fwlSetMemoryRange', (_, min, max) => setMemoryRange(min, max));
    ipcMain.on('fwlMinimize', _ => mainWindow.minimize());
    ipcMain.on('fwlClose', _ => mainWindow.close());
    ipcMain.on('fwlOpenLink', (_, url) => shell.openExternal(url));

    if (!isDev) mainWindow.setMenu(null);

    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
            
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
}

app.on('ready', createWindow);