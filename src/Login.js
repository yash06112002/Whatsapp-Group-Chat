import React from 'react'
import { Button } from '@mui/material'
import './Login.css'
import { auth, provider } from './firebase'
import { useStateValue } from './StateProvider'
import { actionTypes } from './reducer'

function Login() {

    const [{ }, dispatch] = useStateValue();

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then(result => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
            })
            .catch((error) => alert(error.message));
    }

    return (
        <div className='login'>
            <div className='login_container'>
                <img src="https://www.bing.com/th?id=OIP.vgXvWVCdYHyeHI-v_ePjogHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.25&pid=3.1&rm=2" alt='' />
                <div className='login_text'>
                    <h1>Sign In</h1>
                </div>
                <Button onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
        </div >
    )
}

export default Login