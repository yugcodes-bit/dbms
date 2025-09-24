import { useState,useEffect } from 'react';
import { supabase } from "./supabaseClient";
import Taskbar from './components/Taskbar'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MeasureMe from './pages/MeasureMe';
import Profile from './pages/Profile';
import './pages/global.css';
import {BrowserRouter , Link, Route , Routes} from 'react-router-dom'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    // Listen for login/logout changes across tabs
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  return (
    <BrowserRouter>
    <Taskbar isLoggedIn={isLoggedIn} />
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/measurement" element={<MeasureMe />} />
          <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;