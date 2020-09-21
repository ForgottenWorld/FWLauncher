const os = require('os');
const { app } = require('electron');


const getPathForOS = () => {
    const osName = os.platform();

    if (osName === "win32" || osName === "darwin") return (`${app.getPath('appData')}/.forgottenworld`)
    else return (`${app.getPath('home')}/.forgottenworld`)
}

const getSystemMemory = () => os.totalmem() / 1048576;

module.exports = { getPathForOS, getSystemMemory }