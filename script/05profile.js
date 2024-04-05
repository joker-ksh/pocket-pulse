import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  setDoc,
  getDocs,
  addDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFn_5etHr10mxwQPsFr-fv_9Kgat5GLfg",
  authDomain: "authenticationpocketpulse.firebaseapp.com",
  projectId: "authenticationpocketpulse",
  storageBucket: "authenticationpocketpulse.appspot.com",
  messagingSenderId: "206982484780",
  appId: "1:206982484780:web:57b8b4b8031dd86d211289",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.onload = async function () {
    showLoading();
    let useremail;
    auth.onAuthStateChanged(user => {
        console.log(user.email);
        useremail = user.email;
        const name = document.getElementById("name");
        name.innerText = user.email;
        let email = user.email;
        async function profile() {
            let temp;
            const userRef = collection(db, "users");
            const q = await getDocs(userRef);
            q.forEach((doc) => {
              if (doc.data().email == email) {
                temp = doc.id;
              }
            });
            console.log(typeof temp);
            
            let count = 0;
            const myRef = await doc(db, "users", temp);
            const querySnapshot = await getDoc(myRef);
            querySnapshot.data().friendList.forEach((doc) => {
              console.log(doc);
              count++;
            });
            console.log(count);
            let frndcount = document.getElementById("frndcount");
            frndcount.innerText = count;



            //rating updation of the user
            let rate = document.getElementById("rating");
            let rateSum = 0;
            let ucount = 0;
            
            // add the case if the user has no rating
            if(querySnapshot.data().rating == undefined){
              hideLoading();
              return;
            }
            querySnapshot.data().rating.forEach((doc) => {
              rateSum += doc;
              ucount++;
            });
            let tar = parseFloat((rateSum / ucount).toFixed(2));
            console.log(tar);
            rate.innerText = tar;

            
            hideLoading();
          }
          profile();
    });
};

function showLoading() {
  const loading = document.querySelector(".animation-container");
  loading.style.display = "block";
  const dash = document.getElementById("dash");
  dash.style.display = "none";
  const body = document.querySelector("body");
//   body.style.background = "black";
}

function hideLoading() {
  const loading = document.querySelector(".animation-container");
  loading.style.display = "none";
  const dash = document.getElementById("dash");
  dash.style.display = "block";
    const body = document.querySelector("body");
}
