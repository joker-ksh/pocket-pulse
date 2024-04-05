
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {getFirestore,collection,updateDoc,doc,setDoc,getDocs,addDoc,arrayUnion, arrayRemove,getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

let current_user;
let friend;

window.addEventListener('load',function(){
    // console.log(user);
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log("User is logged in:", user.email);
            let friendEmail = localStorage.getItem("friendEmail");
            // console.log("Transaction with:",friendEmail);
            current_user = user.email;
            let curEmail = localStorage.setItem("current_user",current_user);
            friend = friendEmail;
            // let name = getEmailUsername(friendEmail);
            const tittle = document.getElementById('friendEmail');
            tittle.innerText = friendEmail;
            console.log("Transaction with:",friendEmail);
            
            //transaction section
            const btn = document.getElementById("submit");
            btn.addEventListener('click',function(){
                let amt = document.getElementById("amount-input").value;
                let label = document.getElementById('transaction-type');
                // console.log(label.value);
                label = label.value;
                if(amt == ""){
                    alert("please insert amount");
                    window.location.reload();
                    return;
                }
                amt = parseFloat(amt);
                if(amt <= 0){
                    alert("please insert amount greater than 0");
                    window.location.reload();
                    return;
                }

                // let out = document.getElementById('result');
                // out.innerText = `${user.email} has ${label}ed ${amt} from ${firendEmail}`;
                let date = new Date();
                if(label == "borrow"){
                    let temp = user.email;
                    user.email = friendEmail;
                    friendEmail = temp;
                }
                amt = parseFloat(amt);

                console.log(date);
                const transactionRef = collection(db, "transactions");
                setDoc(doc(transactionRef), {
                    lender: user.email,
                    borrower: friendEmail,
                    amount: amt,
                    date: date
                },{ merge: true })
                .then(() => {
                    console.log("Document successfully updated!");
                    window.location.reload();
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                  });
            });
            
        } 
        else {
            console.log("No user is logged in.");
        }
        //lender querry
        let lendArray = getLending(current_user,friend).then((lendArray) => {
            let parent = document.getElementById('parent');
            lendArray.forEach((item) => {
                item.Date = item.date.toDate();
                item.date = item.Date.getDate() + "/" + (item.Date.getMonth() + 1) + "/" + item.Date.getFullYear();
                item.time = item.Date.getHours() + ":" + item.Date.getMinutes() + ":" + item.Date.getSeconds();

            let html = `<tr>
                            <td>${item.amount}</td>
                            <td>I gave</td>
                            <td>${item.date} ${item.time}</td>
                        </tr>`;
            parent.insertAdjacentHTML('beforeend',html);
            });
        });
        // console.log(lendArray);
        
        
        //borrower querry
        getBorrowing(current_user,friend);
        let borrowArray = getBorrowing(current_user,friend).then((borrowArray) => {
            let parent = document.getElementById('parent');
            borrowArray.forEach((item) => {
            //format the date in dd/mm/yyyy and time in hh:mm:ss
            item.Date = item.date.toDate();
            item.date = item.Date.getDate() + "/" + (item.Date.getMonth() + 1) + "/" + item.Date.getFullYear();
            item.time = item.Date.getHours() + ":" + item.Date.getMinutes() + ":" + item.Date.getSeconds();
            

            let html = `<tr>
                            <td>${item.amount}</td>
                            <td>I took</td>
                            <td>${item.date} ${item.time}</td>
                        </tr>`;
            parent.insertAdjacentHTML('beforeend',html);
            });
        });
        // console.log("the name is ",friend);
    });
})




async function getLending(emailA,emailB){
    let res = [];
    const querySnapshot = await getDocs(collection(db, "transactions"));
    querySnapshot.forEach((doc) => {
        if((doc.data().lender == emailA && doc.data().borrower == emailB)){
            res.push(doc.data()); 
        }
    });
    // console.log(res);
    return res;
}	

async function getBorrowing(emailA,emailB){
    let res = [];
    const querySnapshot = await getDocs(collection(db, "transactions"));
    querySnapshot.forEach((doc) => {
        if((doc.data().lender == emailB && doc.data().borrower == emailA)){
            res.push(doc.data());
        }
    });
    // console.log(res);
    return res;
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

let btn = document.getElementById('rating-button');
btn.addEventListener('click',async function(){
    let rating = document.getElementById('rating-input').value;
    if(rating == ""){
        alert("Please enter rating");
        return;
    }

    rating = parseFloat(rating);
    if(rating > 5 || rating < 0){
        alert("Please enter rating between 0 and 5");
        return;
    }

    //how to extract friends collection id from email
    let friend_id = await get_collection_email(friend);
    console.log(friend_id);
    let myref = doc(db, "users", friend_id);
    setDoc(myref, {
        rating: arrayUnion(rating)
    },{ merge: true });
    alert("Rating submitted");
});