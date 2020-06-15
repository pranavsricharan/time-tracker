import firebaseConfig from '../config/firebase-config'
import * as firebase from 'firebase/app'
// Required for side-effects
import 'firebase/firestore';


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const datastore = firebase.firestore();

export default datastore;