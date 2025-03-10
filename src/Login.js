import React from "react";
import { Button, Divider } from "@mui/material";
import "./Login.css";
import { auth, provider } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import { v4 as uuidv4 } from "uuid";

function Login() {
  const [, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };

  const createGuestUser = () => {
    let guestId;
    const existingGuestUser = localStorage.getItem("guestUser");
    if (existingGuestUser) {
      guestId = JSON.parse(existingGuestUser).uid;
    } else {
      guestId = uuidv4();
    }

    const guestUser = {
      uid: guestId,
      displayName: `Guest_${guestId.slice(0, 6)}`,
      photoURL: "https://placeholder.com/guest-avatar.png",
      isGuest: true,
    };

    localStorage.setItem("guestUser", JSON.stringify(guestUser));
    return guestUser;
  };

  const continueAsGuest = async () => {
    try {
      const guestUser = createGuestUser();

      const response = await fetch(`/api/guest-user/${guestUser.uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestId: guestUser.uid }),
      }).then((res) => res.json());

      dispatch({
        type: actionTypes.SET_GUEST_USER,
        user: {
          ...response,
          uid: guestUser.uid,
          displayName: `Guest_${guestUser.uid.slice(0, 6)}`,
          isGuest: true,
        },
      });
    } catch (error) {
      alert("Failed to create guest session: " + error.message);
    }
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://www.bing.com/th?id=OIP.vgXvWVCdYHyeHI-v_ePjogHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.25&pid=3.1&rm=2"
          alt=""
        />
        <div className="login_text">
          <h1>Sign In</h1>
        </div>
        <Button onClick={signIn}>Sign In With Google</Button>
        <Divider style={{ margin: "20px 0" }}>OR</Divider>
        <Button
          onClick={continueAsGuest}
          variant="outlined"
          color="secondary"
          fullWidth
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}

export default Login;
