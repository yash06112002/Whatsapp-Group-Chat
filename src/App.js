import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useStateValue } from './StateProvider';
import { useEffect } from 'react';
import { auth } from './firebase';
import { actionTypes } from './reducer';

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: authUser,
                });
            } else {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: null,
                });
            }
        });
    }, [dispatch]);

  
  
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
