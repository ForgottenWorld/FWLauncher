import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';

export default function SerbenPage(props) {

    const isVanilla = props.serben.name === "Vanilla";
    const authData = props.authData;
    const setError = props.setError;

    const [currentVanillaVersion, setCurrentVanillaVersion] = useState("1.16.3");
    const [vanillaVersions, setVanillaVersions] = useState([]);
    const [launching, setLaunching] = useState(false);
    
    const launchCustom = () => {
        setLaunching(true);
        ipcRenderer.invoke("fwlLaunchCv", authData, props.serben.id).then(
            () => setLaunching(false),
            r => {
                setError(`Impossibile avviare Minecraft: ${r}`);
                setLaunching(false)
            })
    }

    const launchVanilla = () => {
        setLaunching(true);
        ipcRenderer.invoke("fwlLaunch", authData, currentVanillaVersion).then(
            () => setLaunching(false),
            r => {
                setError(`Impossibile avviare Minecraft: ${r}`);
                setLaunching(false)
            })
    }

    const launch = () => { if (isVanilla) launchVanilla(); else launchCustom(); }

    useEffect(() => {
        (async () => {
            try {
                const json = await ipcRenderer.invoke("fwlFetchVanillaList");
                setVanillaVersions(json.versions);
                setCurrentVanillaVersion(json.versions[0].id);
            } catch (err) {
                //showError(err.message)
                console.log(err.message);
            }
        })();
    }, [setVanillaVersions, setCurrentVanillaVersion])

    return (
        <div className={`serben-page ${props.fading ? "fading" : ""}`}>
            <div className="serben-logo-cont">
                <img alt="Server logo" className="serben-logo" src={props.serben.image} />
            </div>
            <div className="serben-title">{props.serben.name}</div>
            { isVanilla
            ? <div className="vanilla-ver-select-container">
                <select onChange={e => setCurrentVanillaVersion(e.target.value)}>
                    { vanillaVersions.map((v, i) => <option key={`v${i}`}>{v.id}</option>) }
                </select>
              </div>
            : null
            }
            <div className="serben-description">{props.serben.description}</div>
            <button 
                onClick={() => launch()} 
                className={(props.authData && !launching) ? "gioca-btn" : "gioca-btn disabled"}>
                GIOCA
            </button>
        </div>
    )
}