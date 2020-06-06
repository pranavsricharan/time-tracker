import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebaseConfig from './firebase-config.js'
import * as serviceWorker from './serviceWorker';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

ReactDOM.render(
  <React.StrictMode>
    <App db={ db } />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
