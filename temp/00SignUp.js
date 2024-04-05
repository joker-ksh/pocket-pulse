// Import the functions you need from the SDKs you need
//second change 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {getFirestore,collection ,addDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFn_5etHr10mxwQPsFr-fv_9Kgat5GLfg",
  authDomain: "authenticationpocketpulse.firebaseapp.com",
  projectId: "authenticationpocketpulse",
  storageBucket: "authenticationpocketpulse.appspot.com",
  messagingSenderId: "206982484780",
  appId: "1:206982484780:web:57b8b4b8031dd86d211289",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const submit = document.getElementById("submit-btn");
submit.addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById("Email").value;
  const password = document.getElementById("pass").value;
  alert("Attempting to create user...");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;//get the user object
      alert('Account created successfully!');
      // Store user UID in Firestore
      return addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email
      });
      // console.log(user.uid,"uid");
     
    })
    .then(()=>{
      console.log('User added to Firestore');
      window.location.href = "02Friends.html";
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
      // ..
    });
});
