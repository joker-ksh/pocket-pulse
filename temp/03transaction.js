
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


const user = auth.currentUser;

window.addEventListener('load',function(){
    
    // console.log(user);
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log("User is logged in:", user.email);
            let userB = localStorage.getItem("friendEmail");
            console.log(userB);



            const btn = document.getElementById("submit");
            
            btn.addEventListener('click',function(){
                let amt = document.getElementById("amount-input").value;
                let label = document.getElementById('transaction-type');
                // console.log(label.value);
                label = label.value;
                let out = document.getElementById('result');
                out.innerText = `${user.email} has ${label}ed ${amt} from ${userB}`;
                let date = new Date();
                if(label == "borrow"){
                    let temp = user.email;
                    user.email = userB;
                    userB = temp;
                }
                amt = parseFloat(amt);
                // console.log(date);
                // console.log(amt);
                // date = date.toISOString();
                console.log(date);
                const transactionRef = collection(db, "transactions");
                setDoc(doc(transactionRef), {
                    lender: user.email,
                    borrower: userB,
                    amount: amt,
                    date: date
                },{ merge: true })
                .then(() => {
                    console.log("Document successfully updated!");
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                  });
                

            });
            
        } 
        
        else {
            // No user is signed in.
            console.log("No user is logged in.");
        }
    });
})

//first get the email of friends with whom the trnsaction going to happen

// if(currentUserEmail === null){
//   alert("Please login first");
//   window.location.href = "SignIn.html";
// }
// else{
//     console.log(currentUserEmail);
// }