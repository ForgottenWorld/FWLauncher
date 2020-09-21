const { default: fetch } = require("electron-fetch");

const fetchNews = async () => {
    const l = await fetch("https://forum.forgottenworld.it/c/25.json");
    const json = await l.json();
    return json;
}

module.exports = { fetchNews }