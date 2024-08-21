import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import DisplayPapers from './Components/DisplayPapers';
import PopUp from './Components/Model';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayPapers />} />
        <Route path="/popup" element={<PopUp/>}/>
      </Routes>
    </Router>
  );
}


export default App;
