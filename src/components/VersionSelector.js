import React from 'react';


export default function VersionSelector(props) {
    
    const versions = props.versions;

    return (
        <div className="version-selector">
            {
                versions
                ? versions.map((v, i) =>
                        <div 
                            key={`gv${i}`} 
                            onClick={() => props.selector(i)}
                            className={`version-item ${i ? null : ("selected" + props.selected)}`}>
                                <img alt="Version logo" className="version-pic" src={v.image}></img>
                                {v.name}
                        </div>
                    )
                : null
            }
        </div>
    )
}