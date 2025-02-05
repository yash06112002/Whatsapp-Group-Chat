import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCbZsQFS7G3Uo9oE_f1aIVw-P3yMCcKZXs",
    authDomain: "whatsapp-yk.firebaseapp.com",
    projectId: "whatsapp-yk",
    storageBucket: "whatsapp-yk.appspot.com",
    messagingSenderId: "14281047747",
    appId: "1:14281047747:web:e633f4652cc4972742ec76"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {        
        console.log("Auth persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Error setting auth persistence:", error);
    });

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;