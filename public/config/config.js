const { dialog } = require('electron');
const Store = require('electron-store');
const store = new Store();

const setMemoryRange = (min, max) => {
    if (min && max) {
        store.set("minMemory", min);
        store.set("maxMemory", max);
    }
}

const storeGet = (key, def) => store.get(key, def);

const storeSet = (key, value) => {
    console.log(`Setting ${key} to ${value}`);
    if (!value) store.delete(key);
    else store.set(key, value);
}

const customJrePrompt = async () => {
    try {
        const r = await dialog.showOpenDialog({ properties: ['openFile'] });
        if (!r.canceled) store.set("jre", r.filePaths[0])
        return (!r.canceled) ? r.filePaths[0] : "";
    } catch(e) {
        console.log(e);
        return "";
    }
}


const getMemoryRange = () => [store.get("minMemory", 2000), store.get("maxMemory", 4000)]
module.exports = { setMemoryRange, getMemoryRange, storeGet, storeSet, customJrePrompt };