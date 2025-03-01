import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
        console.error("Error setting auth persistence:", error);
    });

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;