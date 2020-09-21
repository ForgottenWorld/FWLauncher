import React, { useState, useEffect } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const { ipcRenderer } = require("electron");

export default function OptionsPage(props) {
    const [minRam, setMinRam] = useState(2000);
    const [maxRam, setMaxRam] = useState(4000);
    const [maxSysRam, setMaxSysRam] = useState(4000);

    const showError = props.showError;
    useEffect(() => {
        
        (async () => {
            try {
                const max = await ipcRenderer.invoke("fwlGetSystemMemory");
                setMaxSysRam(Math.floor(max / 1000) * 1000);
                const r = await ipcRenderer.invoke("fwlGetMemoryRange");
                setMinRam(r[0]);
                setMaxRam(r[1]);
            } catch (err) {
                showError(err.message);
            }
        })();

    }, [showError, setMinRam, setMaxRam, setMaxSysRam]);

    const setMemory = (values) => { 
        setMinRam(values[0]);
        setMaxRam(values[1]);    
        ipcRenderer.send("fwlSetMemoryRange", values[0], values[1])
    }

    return (
        <div className="options-page">
            <div className="options-body">
                <div className="options-title">OPZIONI</div>
                <div className="options-rows">
                    <div className="options-item ram">
                        <div className="slider-container">
                            <Range 
                                min={2000}  
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