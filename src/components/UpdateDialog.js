import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';

export default function UpdateDialog() {

    const [isVisible, setIsVisible] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [updateVersion, setUpdateVersion] = useState("");
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
    
        ipcRenderer.on('fwlUpdateAvailable', (_, v) => {
            setUpdateVersion(v);
            setIsVisible(true);
        });

    }, [setIsVisible, setUpdateVersion, setDownloadProgress])

    const handleUpdateBtn = () => {
        ipcRenderer.send("fwlDownloadAndInstallUpdate");
        setDownloading(true);
    }

    return (
        isVisible
        ? <div className="error-dimmer">
            <div className="update-dialog">
                {
                    downloading
                    ? <span className="update-message">Aggiornamento in corso…</span>
                    : <span className="update-message">Nuova versione disponibile<br />
                        <span className="update-version">{updateVersion}</span>
                    </span>
                }
                <button onClick={() => handleUpdateBtn()} disabled={downloading} className="update-btn">AGGIORNA</button>
                <button onClick={() => setIsVisible(false)} className="close-error">CHIUDI</button>
            </div>
        </div>
        : null
    )
}