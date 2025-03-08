import React from 'react';
import './Sidebar.css';
import { auth } from './firebase';
import { actionTypes } from './reducer';
import { Navigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import SidebarChat from './SidebarChat';
import { useState, useEffect } from 'react';
import { useStateValue } from './StateProvider';
import db from './firebase';
import MessageCounter from './MessageCounter';

export default function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const [{ user }, dispatch] = useStateValue();

    useEffect(() => {
        const unsubscribe = db.collection('rooms').onSnapshot(snapshot => (
            setRooms(snapshot.docs.map(doc =>
            ({ id: doc.id, data: doc.data() })
            ))
        ))
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        if(user.isGuest) {
        dispatch({
            type: actionTypes.SET_GUEST_USER,
            user: null,
        });
        return;
    }
        auth.signOut()
        .then(() => {
            Navigate('/login');
            dispatch({
                type: actionTypes.SET_USER,
                user: null,
            });
        }).catch((error) => {
            console.error("Error signing out:", error);
        });
    };

    return (
      <div className="sidebar">
        <div className="sidebar_header">
          <Avatar src={user?.photoURL} />
          <div className="sidebar_headerRight">
            <button className="logout_button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {user?.isGuest && (
          <MessageCounter
            manualCount={user.manualMessagesLeft || 0}
            botCount={user.autoMessagesLeft || 0}
          />
        )}
        <div className="sidebar_search">
          <div className="sidebar_searchContainer">
            <SearchOutlined />
            <input placeholder="Search a Chat" type="text" />
          </div>
        </div>
        <div className="sidebar_chats">
          <SidebarChat addNewChat />
          {rooms.map((room) => (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          ))}
        </div>
      </div>
    );

}

