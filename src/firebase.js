import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCF7lHw_Z7DmZgpoZuYIGveD0eZ8ha7Qyg",
  authDomain: "tattle-9359.firebaseapp.com",
  databaseURL: "https://tattle-9359-default-rtdb.firebaseio.com/",
  projectId: "tattle-9359",
  storageBucket: "tattle-9359.appspot.com",
  messagingSenderId: "849640668400",
  appId: "1:849640668400:web:91c77b3a931a325ef4d635",
  measurementId: "G-17X1MHRTRX",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage, firebase };
export default db;
