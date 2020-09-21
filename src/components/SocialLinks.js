import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faInstagram, faTelegram, faDiscord, faTeamspeak, faGithub, faSteam, faYoutube } from '@fortawesome/free-brands-svg-icons'
const { ipcRenderer } = require("electron");

export default function SocialLinks() {

    const openLink = (url) => ipcRenderer.send("fwlOpenLink", url)

    return (
        <div className="social-links">
            <div className="social-link sl-teamspeak" onClick={() => openLink("ts3server://ts3.forgottenworld.it")}>
                <FontAwesomeIcon icon={faTeamspeak}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-twitter" onClick={() => openLink("https://twitter.com/forgottentweet")}>
                <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-facebook" onClick={() => openLink("https://www.facebook.com/ForgottenWorldCommunity/")}>
                <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-instagram" onClick={() => openLink("https://www.instagram.com/forgottenworld/?hl=it")}>
                <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-telegram" onClick={() => openLink("https://t.me/ForgottenWorldCommunity")}>
                <FontAwesomeIcon icon={faTelegram}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-steam" onClick={() => openLink("https://steamcommunity.com/groups/FWita")}>
                <FontAwesomeIcon icon={faSteam}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-discord" onClick={() => openLink("https://discord.gg/HdXcnBC")}>
                <FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-github" onClick={() => openLink("https://github.com/ForgottenWorld")}>
                <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
            </div>
            <div className="social-link sl-youtube" onClick={() => openLink("https://www.youtube.com/user/MCITAForgottenWorld/")}>
                <FontAwesomeIcon icon={faYoutube}></FontAwesomeIcon>
            </div>
        </div>
    );
}