import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined, MicOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import React, { useState, useEffect, } from 'react'
import { useStateValue } from './StateProvider';
import './Chat.css';
// import axios from './axios';
import { useParams } from "react-router-dom";
import db from './firebase';
// import firebase from 'firebase/compat';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function Chat() {

    const { roomId } = useParams();
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const [roomName, setRoomName] = useState("")
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();

    useEffect(() => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ))
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => (
                setMessages(snapshot.docs.map(doc => doc.data()))
            ))
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [roomId])

    const sendMessage = async (e) => {
        e.preventDefault();

        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    }

    return (
        <div className='chat'>
            <div className='chat_header'>
                <Avatar src={`https://avatars.dicebear.com/api/male/${seed}.svg`} />
                <div className='chat_headerInfo'>
                    <h3>{roomName}</h3>
                    <p>
                        Last Seen {" "}{new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}
                    </p>
                </div>
                <div className='chat_headerRight'>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className='chat_body'>
                {messages.map((message) => (
                    <p className={`chat_message ${message.name === user.displayName && 'chat_reciever'}`}>
                        <span className='chat_name'>{message.name}</span>
                        {message.message}
                        <span className='chat_timestamp'>
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}

            </div>
            <div className='chat_footer'>
                <InsertEmoticon />
                <form >
                    <input value={input} onChange={e => setInput(e.target.value)} type='text' placeholder='Type A Message' />
                    <button onClick={sendMessage} type='submit'>Send</button>
                </form>
                <MicOutlined />
            </div>
        </div>
    )
}

export default Chat;