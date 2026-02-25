import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Zines from './pages/Zines';
import Donate from './pages/Donate';



function App() {

  const [introPlayed, setIntroPlayed] = useState(false);
  const [zineData, setZineData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Create the AbortController
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
        try {
            const endpoint = process.env.REACT_APP_SP;
            // NOTE: Ideally, get this token from a secure source (e.g., Auth Context), not env vars
            const token = process.env.REACT_APP_THE_BEAR; 

            const res = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal: signal // 2. Pass signal to fetch
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();
            
            // Check if unmounted before setting state (optional if using AbortController, but good practice)
            setZineData(data);

        } catch (err) {
            // 3. Handle the specific abort error
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error(err);
                setError(err.message);
            }
        }
    };

    fetchData();

    // 4. Cleanup function runs when component unmounts
    return () => {
        controller.abort();
    };
}, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home introPlayed={introPlayed} setIntroPlayed={setIntroPlayed} />} />
        <Route path="/about" element={<About introPlayed={introPlayed} setIntroPlayed={setIntroPlayed}/>} />
        <Route path="/zines" element={<Zines zineData={zineData} error={error} />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </div>
  );
}

export default App;
