import React, { useState, useEffect } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const { ipcRenderer } = require("electron");

export default function OptionsPage(props) {
    const [minRam, setMinRam] = useState(2000);
    const [maxRam, setMaxRam] = useState(4000);
    const [maxSysRam, setMaxSysRam] = useState(4000);
    const [customJre, setCustomJre] = useState("");

    const showError = props.showError;
    useEffect(() => {
        
        (async () => {
            try {
                const max = await ipcRenderer.invoke("fwlGetSystemMemory");
                setMaxSysRam(Math.floor(max / 1000) * 1000);
                const r = await ipcRenderer.invoke("fwlGetMemoryRange");
                setMinRam(r[0]);
                setMaxRam(r[1]);

                await ipcRenderer.invoke("fwlStoreGet", "jre", "").then(
                    r => setCustomJre(r),
                    r => { /* ignored */ }
                )
            } catch (err) {
                showError(err.message);
            }
        })();

    }, [showError, setMinRam, setMaxRam, setMaxSysRam, setCustomJre]);

    const setMemory = (values) => { 
        setMinRam(values[0]);
        setMaxRam(values[1]);    
        ipcRenderer.send("fwlSetMemoryRange", values[0], values[1])
    }

    const clearJre = () => {
        setCustomJre("");
        ipcRenderer.send("fwlStoreSet", "jre", false);
    }

    const jreInputClick = () => {
        ipcRenderer.invoke("fwlJreCustomPath", "jre").then(
            r => { if (r) setCustomJre(r) },
            _ => { /* ignored */ }
        )
    }

    return (
        <div className="options-page">
            <div className="options-body">
                <div className="options-title">OPZIONI</div>
                <div className="options-rows">
                    <div className="options-item jre-item">
                        <div className="jre-info">JRE personalizzato</div>
                        <div className="jre">
                            <div className="jre-label" onClick={() => jreInputClick()}>
                                {customJre}
                            </div>
                            <FontAwesomeIcon onClick={() => clearJre()} icon={faTrash} className="clear-jre" />
                        </div>
                    </div>
                    <div className="options-item ram">
                        <div className="slider-container">
                            <Range 
                                min={1000}  
                                max={maxSysRam}
                                step={1000}
                                allowCross={false}
                                onChange={values => setMemory(values)}
                                value={[minRam, maxRam]}
                            />
                        </div>
                        <div className="ram-range-container">
                            <div className="min-ram">Ram minima&nbsp;<span className="ram-value">{minRam / 1000}</span> GB</div>
                            <div className="max-ram">Ram massima&nbsp;<span className="ram-value">{maxRam / 1000}</span> GB</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}