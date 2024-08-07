import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db } from "../config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const registerForm = document.querySelector('#registerForm');
const registerName = document.querySelector('#registerName');
const registerEmail = document.querySelector('#registerEmail');
const registerPassword = document.querySelector('#registerPassword');
const registerRePassword = document.querySelector('#registerRePassword');

registerForm.addEventListener('submit', event =>{
    event.preventDefault();
    createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
    .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        await setDoc(doc(db, "users", registerEmail.value), {
            name: registerName.value,
            uid: user.uid
        });
        window.location = 'login.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode)
    });
})