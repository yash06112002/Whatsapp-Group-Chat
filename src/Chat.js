import { AttachFile, KeyboardBackspace, SmartToy } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useStateValue } from "./StateProvider";
import "./Chat.css";
import { useParams, useNavigate } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import axios from "axios";
import { actionTypes } from "./reducer";

function Chat() {
  const navigate = useNavigate();
  const latestMessageRef = useRef(null);
  const { roomId } = useParams();
  const [input, setInput] = useState("");
  const [, setSeed] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
      setSeed(Math.floor(Math.random() * 5000));
    }
  }, [roomId]);

  useEffect(() => {
    document.querySelector(".sidebar").classList.add("inactive");

    return () => {
      document.querySelector(".sidebar")?.classList.remove("inactive");
    };
  }, []);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "auto" }); // No animation, just position directly
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const body = {
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (file) {
      const result = await axios.post(
        "/api/media/upload",
        { file },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      body.file = result.data.filePath;
    }

    if (user.isGuest) {
      if (user.manualMessagesLeft <= 0) {
        alert("You have no manual messages left");
        return;
      }
      const response = await fetch(
        `/api/guest-user/${user.uid}/manual-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guestId: user.uid }),
        }
      ).then((res) => res.json());
      db.collection("rooms").doc(roomId).collection("messages").add(body);
      dispatch({
        type: actionTypes.SET_GUEST_USER,
        user: {
          ...response,
          displayName: `Guest_${user.uid.slice(0, 6)}`,
          isGuest: true,
          uid: user.uid,
        },
      });
    } else {
      db.collection("rooms").doc(roomId).collection("messages").add(body);
    }
    setInput("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const simulateAIResponse = async () => {
    if (user.isGuest) {
      if (user.autoMessagesLeft <= 0) {
        alert("You have no auto messages left");
        return;
      }
      const response = await fetch(
        `/api/guest-user/${user.uid}/auto-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guestId: user.uid }),
        }
      ).then((res) => res.json());
      dispatch({
        type: actionTypes.SET_GUEST_USER,
        user: {
          ...response,
          displayName: `Guest_${user.uid.slice(0, 6)}`,
          isGuest: true,
          uid: user.uid,
        },
      });
    }
    try {
      await axios.post("/api/auto-message/generate", {
          roomId,
        });
    } catch (error) {
      console.error("Error getting AI response:", error);
    }
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <div className="chat_headerBack">
          <IconButton onClick={() => navigate("/")}>
            <KeyboardBackspace />
          </IconButton>
        </div>
        <h3 className="chat_headerInfo">{roomName}</h3>
        <div className="chat_headerRight">
          <IconButton onClick={simulateAIResponse}>
            <SmartToy />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message, index) => (
          <div
            className={`chat_message ${
              message.name === user.displayName && "chat_reciever"
            }`}
            ref={index === messages.length - 1 ? latestMessageRef : null}
            key={index}
          >
            <span className="chat_name">{message.name}</span>
            <div className="chat_content">
              {message.file && (
                <img className="chat_image" src={message.file} alt="file" />
              )}
              <span className="chat_text">{message.message}</span>
            </div>
            <div className="chat_time">
              <span className="chat_timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="chat_footer">
        <label htmlFor="file-input" style={{ cursor: "pointer" }}>
          <IconButton component="span">
            <AttachFile />
          </IconButton>
        </label>
        <form>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type A Message"
          />
          <button onClick={sendMessage} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
