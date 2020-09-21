const { Client } = require('minecraft-launcher-core');
const { getPathForOS } = require("../utils/osUtils")
const fs = require('fs');
const { download } = require('electron-dl');
const { BrowserWindow } = require('electron');
const { getMemoryRange } = require('../config/config');
const { fetchVersion } = require('./fetchVersions');
//const md5File = require('md5-file');

const launchCustomVersion = async (auth, id) => {
    const versionData = await fetchVersion(id);
    const launcher = new Client();
    const path = getPathForOS();
    const versionPath = `${path}/versions/${versionData.id}`;
    const libsPath = `${path}/libs`;
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const memRange = getMemoryRange();

    if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true}, _ => {});
    if (!fs.existsSync(libsPath)) fs.mkdirSync(libsPath, {recursive: true}, _ => {});
    if (!fs.existsSync(versionPath)) fs.mkdirSync(versionPath, {recursive: true}, _ => {});

    const forge = versionData.libs[0];
    const files = versionData.files;
    const sizeToDl = forge.size + files.reduce((acc,l) => acc + l.size, 0);

    const updateDP = (fn, p) => focusedWindow.webContents.send("fwlDownloadProgress", fn, p / sizeToDl * 100)
    const getFn = url => url.split("/").pop();

    const forgePath = `${libsPath}/${getFn(forge.source)}`;

    let progress = 0;

    updateDP(getFn(forge.source), progress);
    if (!fs.existsSync(forgePath)) {
        await download(
            focusedWindow,
            forge.source,
            { directory: libsPath }
        )
    }

    progress += forge.size

    while(files.length != 0) {
        const f = files.shift();
        const fn = getFn(f.source);
        const t = `${versionPath}/${f.path}/${fn}`;

        updateDP(fn, progress);

        if (!fs.existsSync(t)) {
            await download(
                focusedWindow,
                f.source,
                { directory: `${versionPath}/${f.path}` }
            )
        }
        
        progress += f.size;
    }

    updateDP("", 0);

    const opts = {
        clientPackage: null,
        authorization: auth,
        root: versionPath,
        forge: forgePath,
        version: {
            number: versionData.minecraftVersion,
            type: "release"
        },
        memory: {
            max: memRange[1],
            min: memRange[0]
        }
    }
    
    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));

    return launcher.launch(opts);
}

module.exports = { launchCustomVersion }