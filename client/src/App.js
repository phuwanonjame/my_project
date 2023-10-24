
import './component/style.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './component/homepage';
import Navbar from './component/navbar';
import Personal from './component/personal';
import Asset from './component/asset';
function App() {
  return (
    <Router>
      <div className="container">
      <Navbar/>
        <Routes>
          
          <Route path="/" element={<Homepage />} /> 
          <Route path="/personal" element={<Personal />} /> 
          <Route path="/asset" element={<Asset />} /> 


        </Routes>
      </div>
    </Router>
  );
}

export default App;
