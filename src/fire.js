import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyCvVdaikMzRom0t3PkIkLSU2lmoI48PdN0",
  authDomain: "juicylemoncreative.firebaseapp.com",
  databaseURL: "https://juicylemoncreative.firebaseio.com",
  projectId: "juicylemoncreative",
  storageBucket: "juicylemoncreative.appspot.com",
  messagingSenderId: "974521242270"
};
var fire = firebase.initializeApp(config);
export default fire;