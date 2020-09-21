const { Authenticator } = require('minecraft-launcher-core');
const Store = require('electron-store');

const store = new Store();

const loginWithCredentials = (username, password, saveCreds) => 
    new Promise((res, fail) => 
        Authenticator
            .getAuth(username, password)
            .then(v => { 
                    if (saveCreds)
                        store.set('authCredentials', v);
                    else
                        store.delete('authCredentials');

                    res(v)
                },
                r => fail(r)
        ));

const refreshToken = () => 
    new Promise((res, fail) => {
        const creds = getStoredCreds();
        if (creds)
            Authenticator.validate(creds.access_token, creds.client_token)
            .then(
                () => res(creds),
                () => Authenticator
                    .refreshAuth(
                        creds.access_token,
                        creds.client_token,
                        creds.selected_profile)
                    .then(v => {
                            store.set('authCredentials', v);
                            res(v);
                        }, r => {
                            store.delete('authCredentials');
                            fail(r);
                        }))
        else res(null)
    })

const logout = () =>
    new Promise((res, fail) => {
        const creds = getStoredCreds();
        if (!creds) fail(null);
        Authenticator.invalidate(creds.access_token, creds.client_token)
            .then(v => {
                        store.delete('authCredentials');
                        res();
                    }, r => fail(r))
    })

const getStoredCreds = () => store.get('authCredentials', null);

module.exports = { loginWithCredentials, refreshToken, getStoredCreds, logout }