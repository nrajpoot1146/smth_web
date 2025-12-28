import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import './styles/index.css';
import {Dashboard} from './pages/Dashboard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Mapping URL path to Component */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
