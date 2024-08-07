import { signInWithEmailAndPassword , sendPasswordResetEmail , GoogleAuthProvider , signInWithPopup , GithubAuthProvider  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db } from "../config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const form = document.querySelector('#logInForm');
const email = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const forgotPassword = document.querySelector('#forgotPassword');
const googleBtn = document.querySelector('#googleBtn');
const githubBtn = document.querySelector('#githubBtn');


// signs in through email and password
form.addEventListener('submit', event =>{
    event.preventDefault();
    signInWithEmailAndPassword(auth, email.value, passwordInput.value)
    .then((userCredential) => {
        window.location = 'index.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode)
    });
})


// forgot password functionality
forgotPassword.addEventListener('click', ()=>{
    const resetEmail = prompt('Enter your email');
    sendPasswordResetEmail(auth, resetEmail)
    .then(() => {
        alert('Password reset sent on your email address!')
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode)
    });
});


// signs in through google
googleBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    signInWithPopup(auth, provider)
    .then(async (result) => {
        const user = result.user;
        console.log(user.email);
        console.log(user.displayName);
        console.log(user.uid);
        await setDoc(doc(db, "users", user.email), {
            name: user.displayName,
            uid: user.uid
        });
        window.location = 'index.html';
    }).catch((error) => {
    const errorCode = error.code;
    alert(errorCode)
    });
});


// signs in through github
githubBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    signInWithPopup(auth, githubProvider)
    .then(async (result) => {
        const user = result.user;
        console.log(user.email);
        console.log(user.displayName);
        console.log(user.uid);
        await setDoc(doc(db, "users", user.email), {
            name: user.displayName,
            uid: user.uid
        });
        window.location = 'index.html';
    }).catch((error) => {
    const errorCode = error.code;
    alert(errorCode)
    });
});