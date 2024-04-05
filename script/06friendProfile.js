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
  let friendEmail = localStorage.getItem("friendEmail");
  console.log("Transaction with:", friendEmail);

  const dashName = document.getElementById("friendEmail");
  dashName.innerText = friendEmail;

  async function getFriendsUid() {
    let temp;
    const userRef = collection(db, "users");
    const q = await getDocs(userRef);
    q.forEach((doc) => {
      if (doc.data().email == friendEmail) {
        temp = doc.id;
      }
    });
    console.log(temp);
    
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
    hideLoading();
  }
  getFriendsUid();


  let rate = document.getElementById("rating");
  let friend_id = await get_collection_email(friendEmail);
  console.log(friend_id);
  let myref = doc(db, "users", friend_id);
  let rateSum = 0;
  let ucount = 0;
  const docSnap = await getDoc(myref);
  docSnap.data().rating.forEach((doc) => {
    rateSum += doc;
    ucount++;
  });
  console.log(rateSum);

  let tar = parseFloat((rateSum / ucount).toFixed(2));
  rate.innerText = tar;
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


async function get_collection_id(uid){
  let res = null;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if(doc.data().uid == uid){
      res = doc.id;
    }
  })
  return res;
}

async function get_collection_email(email){
  let res = null;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if(doc.data().email == email){
      res = doc.id;
    }
  })
  return res;
}