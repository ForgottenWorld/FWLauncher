import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import Colorizer from './Colorizer';


const { ipcRenderer } = require("electron");

export default function TitleBar(props) {

    const minimize = () => ipcRenderer.send("fwlMinimize")
    const close = () => ipcRenderer.send("fwlClose")


    return (
        <div className="titlebar">
            <div className="titlebar-title">
                ForgottenWorld Launcher
            </div>
            <div className="titlebar-actions">
                <Colorizer setColor={props.setColor} />
                <div className="minimize" onClick={minimize}><FontAwesomeIcon icon={faMinusCircle} /></div>
                <div className="close" onClick={close}><FontAwesomeIcon icon={faTimesCircle} /></div>
            </div>
        </div>
    )
}