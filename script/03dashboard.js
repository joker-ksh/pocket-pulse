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
onload = submit.addEventListener("click", async function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const user = auth.currentUser;
  if(email == user.email){
    alert("You cannot add yourself as a friend");
    return;
  }
  console.log(user);
    const currentUserEmail = user.email;
    let userExists = false;
    const querySnapshot = await getDocs(collection(db, "users"));
    let userToAdd;
    // showLoading();
    querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.email === email) {
              userExists = true;
              userToAdd = userData.email;
              alert("User exists!");
              showLoading();
            return;
          }
      });

    if(userExists == false){
      alert("User not found!");
      return;
    }
    
    const my_doc_id = await get_collection_id(user.uid.toString());
    // myUid = my_doc_id;
    const friendRef = await doc(db, "users", my_doc_id);
    const friendExists = await checkFriendsExits(friendRef,userToAdd);
    localStorage.setItem("friendEmail",userToAdd);
    if(friendExists){
      alert("User already in your friend list");
      // window.location.href = "/00htmlFiles/04transaction.html";
      hideLoading();
      return;
    }
      await updateDoc(friendRef,{
        friendList: arrayUnion(userToAdd)
      });

    //now insert me in the my friend's array also
    const friend_doc_id = await get_collection_email(email);
    // console.log("69 hai ye",friend_doc_id);
    const myRef = await doc(db, "users", friend_doc_id);
    await updateDoc(myRef,{
      friendList: arrayUnion(currentUserEmail)
    });

    location.reload();
    hideLoading();
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


//friend display
onload=function(){
  showLoading();
  auth.onAuthStateChanged(async function(user) {
      // showLoading();
      // User is signed in.
      
      console.log("User is logged in:", user.email);
      // const email = document.getElementById("email");
      const my_doc_id = await get_collection_id(user.uid.toString());
      console.log(my_doc_id);
      const myRef = await doc(db, "users", my_doc_id);
      // console.log(myRef);
      const querySnapshot = await getDoc(myRef);
      if(querySnapshot.data().friendList == null)
      {
        // console.log("No friends");
        hideLoading();
        return;
      }
      // showLoading();
      console.log("Entering into the friend list")
      querySnapshot.data().friendList.forEach(async (email) => {
        // console.log(email);
        let mail;
        const beforeAt = email.substring(0, email.indexOf('@'));
        mail = beforeAt;
        //get rating of the friends

        const friend_id = await get_collection_email(email);
        console.log(friend_id);
        
        const friendRef = await doc(db, "users", friend_id);
        const friendQuerySnapshot = await getDoc(friendRef);
        let rateSum = 0;
        let ucount = 0;
        let result;
        //add all the array elements in the users rating array
        if(friendQuerySnapshot.data().rating == null){
          // console.log("No rating");
          result = 5;
        }
        else{
          friendQuerySnapshot.data().rating.forEach((rate) => {
            rateSum += rate;
            ucount++;
          });
          result = (rateSum/ucount).toFixed(2);
        }
        
        // console.log(arr);

        const html = `
                <div class="items">
                    <div class="item1">
                        <h3 class="t-op-nextlvl mailwali">${mail}</h3>
                        <h3 class="t-op-nextlvl">${result}</h3>
                        <button id="${email}" class="t-op-nextlvl label-tag">Transaction</button>
                    </div>
                </div>`;
        const parent = document.getElementById("parent");
        parent.insertAdjacentHTML('beforeend',html);
        const btn = document.getElementById(`${email}`);
        btn.addEventListener("click",function(){
          console.log("clicked");
          localStorage.setItem("friendEmail",email);
          window.location.href = "/htmlFiles/04transaction.html";
        });
      });

      //fetch total lending amount and update the dashboard
      const lendAmount = document.getElementById("lended");
      const lendQuerySnapshot = await getDocs(collection(db, "transactions"));
      let totalLend = 0;
      lendQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        if(data.lender == user.email){
          totalLend += data.amount;
        }
      });
      let lend = totalLend;
      lendAmount.innerText = "₹"+totalLend.toFixed(2);
      
      //fetch total borrowed amount and update the dashboard
      const borrowAmount = document.getElementById("borrowed");
      const borrowQuerySnapshot = await getDocs(collection(db, "transactions"));
      let totalBorrow = 0;
      borrowQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        if(data.borrower == user.email){
          totalBorrow += data.amount;
        }
      });
      let borrow = totalBorrow;
      borrowAmount.innerText = "₹"+totalBorrow.toFixed(2);

      const text = document.getElementById("pay");
      if(borrow > lend)
      {
        text.innerText = "Amount to pay";
      }
      else if(borrow == lend){
        text.innerHTML="";
      }

      else{
        text.innerText = "Amount to receive";
      }
      
      const amount = document.getElementById("amt");
      amount.innerText = "₹"+Math.abs(borrow-lend).toFixed(2);
      hideLoading();
    });
}




function showLoading(){
  const loading = document.querySelector(".animation-container");
  loading.style.display = "block";
  const dash = document.getElementById("dash");
  dash.style.display = "none";
}

function hideLoading(){
  const loading = document.querySelector(".animation-container");
  loading.style.display = "none";
  const dash = document.getElementById("dash");
  dash.style.display = "block";
}



//signout user
let docSignout = document.getElementById("signout");
docSignout.addEventListener("click",function(){
  auth.signOut().then(() => {
    console.log("User signed out");
    window.location.href = "/index.html";
  }).catch((error) => {
    console.log("Error in signing out");
  });
});


let btn = document.getElementById("gst");
      btn.addEventListener("click", () => {
      window.location.href = "/htmlFiles/07gst.html";
});