import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {getFirestore,collection,updateDoc,doc,getDocs,addDoc,arrayUnion, arrayRemove,getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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


const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const user = auth.currentUser;
  console.log(user);
    const currentUserEmail = user.email;
    let userExists = false;
    const querySnapshot = await getDocs(collection(db, "users"));
    let userToAdd;
    querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.email === email) {
              userExists = true;
              userToAdd = userData.email;
              alert("User found!");
            return;
          }
      });

    if(userExists == false){
      alert("User not found!");
      return;
    }
    
    const my_doc_id = await get_collection_id(user.uid.toString());
    const friendRef = await doc(db, "users", my_doc_id);
    const friendExists = await checkFriendsExits(friendRef,userToAdd);
    localStorage.setItem("friendEmail",userToAdd);
    if(friendExists){
      alert("User already in your friend list");
      window.location.href = "03transaction.html";
      return;
    }
      await updateDoc(friendRef,{
        friendList: arrayUnion(userToAdd)
      })
      
    //now insert me in the my friend's array also
    const friend_doc_id = await get_collection_email(email);
    const myRef = await doc(db, "users", friend_doc_id);
    await updateDoc(myRef,{
      friendList: arrayUnion(currentUserEmail)
    });

    window.location.href = "03transaction.html";
});


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

async function checkFriendsExits(Fref,email){
  let res = false;
  const querySnapshot = await getDoc(Fref);
  const data = querySnapshot.data();
 
  if(data.friendList && data.friendList.includes(email)){
    res = true;
  }
  return res;
}


