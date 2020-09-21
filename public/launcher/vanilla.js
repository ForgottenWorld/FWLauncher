const { Client } = require('minecraft-launcher-core');
const { getPathForOS } = require("../utils/osUtils")
const fs = require('fs');
const Store = require('electron-store');
const { BrowserWindow } = require('electron');
const store = new Store();

const launchVanilla = (auth, version) => {
    
    const launcher = new Client();
    const path = `${getPathForOS()}/versions/vanilla/${version}`;
    const focusedWindow = BrowserWindow.getFocusedWindow();

    const updateDP = (fn, p) => focusedWindow.webContents.send("fwlDownloadProgress", fn, p);

    if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true});

    const opts = {
        clientPackage: null,
        authorization: auth,
        root: path,
        version: {
            number: version,
            type: "release"
        },
        memory: {
            max: store.get("maxMemory", 4000),
            min: store.get("minMemory", 2000)
        },
        javaPath: store.get("jre", "java")
    }
    
    const handleDownloadStatus = e => {
        console.log(e);
        updateDP(e.name, e.current / e.total * 100);
    };

    launcher.on('download-status', handleDownloadStatus);

    launcher.once('download', () => { 
        launcher.removeListener('download-status', handleDownloadStatus);
        updateDP("", 0);
    });

    const handleProgress = e => {
        if (e.type !== "assets") return;

        if (e.task === e.total) {
            launcher.removeListener('progress', handleProgress);
            updateDP("", 0);
            return
        }

        console.log(e);
        updateDP(`Download asset: ${e.task}/${e.total}`, e.task / e.total * 100);
    };

    launcher.on('progress', handleProgress);

    launcher.on('debug', e => console.log(e));
    launcher.on('data', e => console.log(e));

    const detachListeners = () => {
        updateDP("", 0);
        launcher.removeListener('progress', handleProgress);
        launcher.removeListener('download-status', handleDownloadStatus);
    };

    return launcher.launch(opts).then(detachListeners, detachListeners);

}

module.exports = { launchVanilla }