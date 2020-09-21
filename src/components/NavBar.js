import React from 'react';

export default function NavBar(props) {

    return (
        <div className={"navbar"}>
            <div className={`navbar-item nav-gioca selected${props.selected}`} onClick={() => props.selector(0)}>Server</div>
            <div className="navbar-item" onClick={() => props.selector(1)}>News</div>
            <div className="navbar-item" onClick={() => props.selector(2)}>Opzioni</div>
        </div>
    )
}