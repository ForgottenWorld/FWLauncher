import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';

export default function LoadingBar(props) {

    const [currentlyDownloading, setCurrentlyDownloading] = useState("");
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
    
        ipcRenderer.on("fwlDownloadProgress", (e, fn, progress) => {
            setCurrentlyDownloading(fn);
            setDownloadProgress(progress);
        });
    
    }, [setCurrentlyDownloading, setDownloadProgress]);

    return (
        <div className="loading-bar" >
            {currentlyDownloading
            ? <div className="loading-bar-fn">{currentlyDownloading}</div>
            : null}
            <div className="loading-bar-progress" style={{width: downloadProgress + "%"}}></div>
        </div>
    )
}