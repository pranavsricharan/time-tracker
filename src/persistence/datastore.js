
import firebaseConfig from '../config/firebase-config.js'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const datastore = firebase.firestore();

export default datastore;