const { default: fetch } = require("electron-fetch");

const fetchVersions = async () => {
    const l = await fetch("https://forgottenworld.it/launcher/versions/versions.json");
    return await l.json();
}

const fetchVersion = async (id) => {
    const l = await fetch(`https://forgottenworld.it/launcher/versions/${id}/${id}.json`);
    return await l.json();
}

const fetchVanillaList = async () => {
    const l = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json");
    return await l.json();
}

module.exports = { fetchVersions, fetchVersion, fetchVanillaList }