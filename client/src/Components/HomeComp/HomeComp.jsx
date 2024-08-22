// src/pages/Home.jsx
import { useState } from 'react';
import './HomeComp.css';
import DisplayPapers from '../DisplayPapers';
import DisplayWebOfScience from '../DisplayWebOfScience';

const HomeComp = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleShowGoogle = () => setSelectedComponent('google');
  const handleShowWos = () => setSelectedComponent('wos');

  return (
    <div className="home-container">
      <h1 className="home-title">Display Page</h1>
      <div className="button-container">
        <button onClick={handleShowGoogle} className="button">Google</button>
        <button onClick={handleShowWos} className="button">WOS</button>
      </div>
      <div className="content">
        {selectedComponent === 'google' && <DisplayPapers />}
        {selectedComponent === 'wos' && <DisplayWebOfScience />}
      </div>
    </div>
  );
};

export default HomeComp;
