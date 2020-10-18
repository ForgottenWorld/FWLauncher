import React, { useState, useEffect, useCallback } from 'react'
import missingFace from '../missingface.png';

const { ipcRenderer } = require("electron");

export default function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [saveCreds, setSaveCreds] = useState(false);

    const logout = () => 
        ipcRenderer.invoke("fwlLogout").then(
            () => props.authDataSetter(null),
            r => props.showError(r.message)
        );

    const authDataSetter = props.authDataSetter;
    const showError = props.showError;

    const login = useCallback(() => {
        if (!username.trim() || !password) return;

        ipcRenderer.invoke("fwlLogin", username, password, saveCreds).then(
            r => authDataSetter(r),
            r => {
                console.log(r.message);
                showError("Login non riuscito!");
            });

    },[username, password, authDataSetter, showError, saveCreds]);

    useEffect(() => {

        (async () => {
            await ipcRenderer.invoke("fwlRefreshToken").then(
                r => { if (r) authDataSetter(r) },
                () => console.log("Auth token couldn't be refreshed.")
            );
    
            await ipcRenderer.invoke("fwlStoreGet", "saveCreds", false).then(
                r => { setSaveCreds(r) },
                r => { /* ignored */ }
            )
        })()

        const listener = event => {
            if (!props.authData && (event.code === "Enter" || event.code === "NumpadEnter"))
                login();
        };

        document.addEventListener("keydown", listener);

        return () => document.removeEventListener("keydown", listener);
    }, [authDataSetter, showError, props.authData, login, setSaveCreds]);

    const handleSaveCredsChanged = save => {
        setSaveCreds(save)
        ipcRenderer.send("fwlStoreSet", "saveCreds", save);
    }

    return (
        props.authData
        ? <div className="login-form signed-in">
            <div className="login-form-face-name-container">
                <img className="logged-player-face" onError={e => e.target.src = missingFace} alt=" " src={`https://minotar.net/avatar/${props.authData.uuid}/32.png`}></img>
                <span className="logged-player-name">{props.authData.name}</span>
            </div>
            <button onClick={logout}>Logout</button>
        </div>
        : <div className="login-form">
            <input type="text" name="username" placeholder="E-MAIL" onChange={e => setUsername(e.target.value)}></input>
            <input type="password" name="password" placeholder="PASSWORD" onChange={e => setPassword(e.target.value)}></input>
            <span className="save-creds">
                <input type="checkbox" name="saveCredentials" checked={saveCreds} onChange={e => handleSaveCredsChanged(e.target.checked)}></input>SALVA
            </span>
            <button onClick={login}>Login</button>
        </div>
    )
}