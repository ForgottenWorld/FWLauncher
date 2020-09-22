import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';

export default function Colorizer(props) {

    const setColor = props.setColor;

    const [open, setOpen] = useState(false);

    useEffect(() => {

        ipcRenderer.invoke("fwlStoreGet", "color", 1).then(
            r => { setColor(r) },
            r => { /* ignored */ }
        )

    }, [setColor])

    const changeColor = n => {
        ipcRenderer.send("fwlStoreSet", "color", n);
        setColor(n);
    }

    return (
        <div className="colorize" onClick={() => setOpen(!open)} >
            <FontAwesomeIcon icon={faPaintBrush} />
            {
                open
                ? <div className="colorizer" >
                    <div className="color-tray">
                        {
                            [1,2,3,4,5,6].map(n => 
                                <div 
                                    key={`cp-${n}`}
                                    className={`color-${n}`}
                                    onClick={() => changeColor(n)}
                                    ></div>)
                        }
                    </div>
                </div>
                : null
            }
        </div>
        
    )
}