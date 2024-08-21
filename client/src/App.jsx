import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import DisplayPapers from './Components/DisplayPapers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayPapers />} />
      </Routes>
    </Router>
  );
}


export default App;
