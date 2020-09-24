import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import VersionSelector from './components/VersionSelector';
import NavBar from './components/NavBar';
import TitleBar from './components/TitleBar';
import SocialLinks from './components/SocialLinks';
import SerbenPage from './components/SerbenPage';
import OptionsPage from './components/OptionsPage';
import LoadingBar from './components/LoadingBar';
import vanillaIcon from './vanilla.png';
import NewsPage from './components/NewsPage';
import UpdateDialog from './components/UpdateDialog';

const { ipcRenderer } = require('electron');

function App() {
  const [selectedSerben, setSelectedSerben] = useState(0);
  const [selectingSerben, setSelectingSerben] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [canSelect, setCanSelect] = useState(true);
  const [versions, setVersions] = useState(null);
  //const [versionData, setVersionData] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [serbenPageFading, setSerbenPageFading] = useState(false);
  const [color, setColor] = useState(1);

  const fadeToSerben = (serben) => {
    if (!canSelect || selectingSerben === serben) return;
    setCanSelect(false);
    setSelectingSerben(serben);
    setSerbenPageFading(true);
    setTimeout(() => {
        setCanSelect(true);
        setSelectedSerben(serben);
        setSerbenPageFading(false);
    }, 200);
  }

  useEffect(() => {
    
    const fetchList = async () => {
      try {
        return await ipcRenderer.invoke("fwlFetchVersions")
      } catch (err) {
        setError(err.message)
      }
    }

    (async () => {
      const obj = await fetchList()
      const li = obj.versions;
      setVersions([...li, { image: vanillaIcon, name: "Vanilla" }]);
      setIsLoaded(true);
    })();

  }, [setVersions, setIsLoaded]);

  return (
    isLoaded
    ? <div className={`app color-${color}`}>
        <UpdateDialog></UpdateDialog>
        {
          error 
          ? <div className="error-dimmer">
              <div className="error-window">{error}<button className="close-error" onClick={() => setError(null)}>CHIUDI</button></div>
            </div>
          : null}
        <div className="app-header">
          <TitleBar setColor={setColor} />
          <NavBar selected={selectedPage} selector={setSelectedPage} />
        </div>
        <div className={`page-selector selected${selectedPage}`}>
          { versions
          ? <div className="app-top-panel">
              <VersionSelector versions={versions} selected={selectingSerben} selector={fadeToSerben}/>
              <div className="app-top-right-panel">
                <SerbenPage 
                  fading={serbenPageFading} 
                  serben={versions[selectedSerben]} 
                  setError={setError}
                  authData={authData}/>
              </div>
            </div>
          : <div className="app-top-panel">
              <div className="version-loader"></div>
            </div> }
          <div className="app-top-panel">
            <NewsPage showError={setError}/>
          </div>
          <div className="app-top-panel">
            <OptionsPage showError={setError} />
          </div>
        </div>
        <div className="app-bottom-panel">
          <LoadingBar />
          <div className="bottom-panel-social-login">
            <SocialLinks />
            {versions
            ? <LoginForm showError={setError} authDataSetter={setAuthData} authData={authData}/>
            : null}
          </div>
        </div>
      </div>
    : <div className="app">
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
  );
}

export default App;
