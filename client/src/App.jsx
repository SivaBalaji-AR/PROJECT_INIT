import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import DisplayPapers from './Components/DisplayPapers';
import DisplayWebOfScience from './Components/DisplayWebOfScience';
import ExcelUploader from './Components/ExcelUploader/ExcelUploader';
import HomeComp from './Components/HomeComp/HomeComp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ExcelUploader />}/>
        <Route path="/google" element={<DisplayPapers />} />
        <Route path='/wos' element={<DisplayWebOfScience/>}/>
        <Route path='/Home' element={<HomeComp/>}/>
      </Routes>
    </Router>
  );
}


export default App;
