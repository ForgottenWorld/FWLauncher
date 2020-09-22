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

    ipcMain.handle('fwlLogin', (e, username, password, saveCreds) => loginWithCredentials(username, password, saveCreds));
    ipcMain.handle('fwlRefreshToken', e => refreshToken());
    ipcMain.handle('fwlLogout', e => logout());
    ipcMain.handle('fwlGetSystemMemory', e => getSystemMemory());
    ipcMain.handle('fwlGetMemoryRange', e => getMemoryRange());
    ipcMain.handle('fwlLaunchCv', (e, auth, id) => launchCustomVersion(auth, id));
    ipcMain.handle('fwlLaunch', (e, auth, version) => launchVanilla(auth, version));
    ipcMain.handle('fwlFetchVersions', e => fetchVersions());
    ipcMain.handle('fwlFetchVanillaList', e => fetchVanillaList());
    ipcMain.handle('fwlFetchNews', e => fetchNews());
    ipcMain.handle('fwlStoreGet', (e, key, def) => storeGet(key, def));
    ipcMain.handle('fwlJreCustomPath', e => customJrePrompt());

    ipcMain.on('fwlStoreSet', (e, key,value) => storeSet(key, value));
    ipcMain.on('fwlSetMemoryRange', (e, min, max) => setMemoryRange(min, max));
    ipcMain.on('fwlMinimize', e => mainWindow.minimize());
    ipcMain.on('fwlClose', e => mainWindow.close());
    ipcMain.on('fwlOpenLink', (e, url) => shell.openExternal(url));

    if (!isDev) mainWindow.setMenu(null);

    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

}

app.on('ready', createWindow);