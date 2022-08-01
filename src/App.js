import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className='app_body'>

          <Router>
            <Routes>
              <Route path='/rooms/:roomId' element={<><Sidebar /><Chat /></>} />
              <Route path='/' element={<><Sidebar /></>} />
            </Routes>
          </Router>
        </div>
      )}


    </div>
  );
}

export default App;
