const Store = require('electron-store');
const store = new Store();

const setMemoryRange = (min, max) => {
    if (min && max) {
        store.set("minMemory", min);
        store.set("maxMemory", max);
    }
}

const getMemoryRange = () => [store.get("minMemory", 2000), store.get("maxMemory", 4000)]
module.exports = { setMemoryRange, getMemoryRange };