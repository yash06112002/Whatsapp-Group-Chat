import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined, MicOutlined, KeyboardBackspace } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react'
import { useStateValue } from './StateProvider';
import './Chat.css';
import { useParams, useNavigate } from "react-router-dom";
import db from './firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function Chat() {
    const navigate = useNavigate();
    const latestMessageRef = useRef(null);
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
            setSeed(Math.floor(Math.random() * 5000))
        }
    }, [roomId])

    useEffect(() => {
        document.querySelector('.sidebar').classList.add('inactive');
        
        return () => {
            document.querySelector('.sidebar').classList.remove('inactive');
        }
    }, [])

    useEffect(() => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "auto" }); // No animation, just position directly
        }
    }, [messages])

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
                <div className='chat_headerBack'>
                <IconButton>
                    <KeyboardBackspace onClick={() => navigate('/')} />
                </IconButton>
                </div>
                <h3 className='chat_headerInfo'>
                    {roomName}
                </h3>
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
                {messages.map((message, index) => (
                    <p
                        className={`chat_message ${message.name === user.displayName && 'chat_reciever'}`}
                        ref={index === messages.length - 1 ? latestMessageRef : null}
                    >
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