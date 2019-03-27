import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBV83o1xp_tzpjX76vNOY8NIwsr4ntDbro",
    authDomain: "r-budget.firebaseapp.com",
    databaseURL: "https://r-budget.firebaseio.com",
    projectId: "r-budget",
    storageBucket: "r-budget.appspot.com",
    messagingSenderId: "1042524714500"
};

firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
