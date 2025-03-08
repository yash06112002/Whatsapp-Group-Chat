import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useStateValue } from './StateProvider';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { actionTypes } from './reducer';
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import InfoModal from "./InfoModal";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [infoOpen, setInfoOpen] = useState(false);

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
      <IconButton
        className="info-button"
        onClick={() => setInfoOpen(true)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#128C7E",
          color: "white",
          "&:hover": {
            backgroundColor: "#075E54",
          },
        }}
      >
        <Info />
      </IconButton>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>
            <Routes>
              <Route
                path="/rooms/:roomId"
                element={
                  <>
                    <Sidebar />
                    <Chat />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <>
                    <Sidebar />
                  </>
                }
              />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
