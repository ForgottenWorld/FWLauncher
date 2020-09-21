import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { ipcRenderer } from 'electron';
import React, { useState } from 'react';

export default function Colorizer(props) {

    const [open, setOpen] = useState(false);

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
                                    onClick={() => props.setColor(n)}
                                    ></div>)
                        }
                    </div>
                </div>
                : null
            }
        </div>
        
    )
}