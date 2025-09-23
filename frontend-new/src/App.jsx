import Taskbar from './components/Taskbar'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MeasureMe from './pages/MeasureMe'
import './pages/global.css';

import {BrowserRouter , Link, Route , Routes} from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
    <Taskbar />
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/measurement" element={<MeasureMe />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;