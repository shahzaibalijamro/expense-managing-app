import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, Timestamp, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { db, auth } from "./config.js";

const form = document.querySelector('#form');
const inputTitle = document.querySelector('.input-title');
const inputAmount = document.querySelector('.input-amount');
const totalAmountWrapper = document.querySelector('.total-amount-2');
const listWrapper = document.querySelector('.list-wrapper-out');
const sort = document.querySelector('#sort');
const sortAmount = document.querySelector('#sortAmount');
const logoImg = document.querySelector('#logo-img');
const navButtonWrapper = document.querySelector('#nav-button-wrapper');
const signOutBtn = document.querySelector('#sign-out');
const userNameNav = document.querySelector('#userNameNav');
const loginAndRegister = document.querySelector('#login-and-register');
let expenseArr = [];
let totalAmount;
let currentUser = [];
signOutBtn.style.display = 'none';
loginAndRegister.style.display = 'block';

// checking user status
async function getUser() {
    auth.onAuthStateChanged(async user => {
        if (user) {
            loginAndRegister.style.display = 'none';
            signOutBtn.style.display = 'block';
            const uid = user.uid;
            // console.log("User UID: ", uid);
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                currentUser.push({
                    name: doc.data().name,
                    dp: doc.data().dp,
                    uid: uid
                })
            });
            userNameNav.innerHTML = currentUser[0].name;
            if (currentUser[0].dp) {
                logoImg.src = currentUser[0].dp;
            } else {
                logoImg.src = "https://i.pinimg.com/originals/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.webp";
            }
        } else {
            listWrapper.innerHTML += `
            <div class="d-flex justify-content-center list-wrapper-in w-100">
                    <h1 style="font-size: 18px;margin: 0px;text-align:center;padding-bottom:20px">Please sign in to view your expenses</h1>
            </div>
        `
        }
    });
}
getUser();



// value sumbition
form.addEventListener('submit', event => {
    event.preventDefault();
    addExpense();
})



// pushing data to firestore and array
async function addExpense() {
    auth.onAuthStateChanged(async user => {
        if (user) {
            const uid = user.uid;
            let toNumber = Number(inputAmount.value);
            try {
                const docRef = await addDoc(collection(db, "expenses"), {
                    expenseTitle: inputTitle.value,
                    expenseAmount: toNumber,
                    time: Timestamp.fromDate(new Date()),
                    uid: uid
                });
                expenseArr.push({
                    expenseTitle: inputTitle.value,
                    expenseAmount: toNumber,
                    id: docRef.id,
                    uid: uid
                })
                console.log("Document written with ID: ", docRef.id);
                inputTitle.value = '';
                inputAmount.value = '';
                console.log(expenseArr);
                renderExpense();
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            alert('Please sign in to add an expense!')
        }
    });
}



// get data from firestore
async function getData() {
    auth.onAuthStateChanged(async user => {
        if (user) {
            const uid = user.uid;
            const singleUserRef = collection(db, "expenses");
            const q = query(singleUserRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                expenseArr.push({
                    expenseTitle: doc.data().expenseTitle,
                    expenseAmount: Number(doc.data().expenseAmount),
                    time: doc.data().time,
                    id: doc.id
                });
            });
            renderExpense();
        } else {
            console.log("No user signed in");
        }
    });
}
getData();




// rendering data on the screen 
function renderExpense() {
    listWrapper.innerHTML = '';
    totalAmountCalc()
    if (expenseArr.length < 1) {
        listWrapper.innerHTML += `
        <div class="d-flex justify-content-center list-wrapper-in w-100">
            <h1 style="font-size: 18px;margin: 0px;text-align:center;padding-bottom:15px">No expenses found.</h1>
        </div>
`
    }
    for (let i = 0; i < expenseArr.length; i++) {
        listWrapper.innerHTML += `
        <div class="d-flex justify-content-center list-wrapper-in w-100">
                    <div class="list-style-left">
                    </div>
                    <div style="width: 33%;" class="d-flex align-items-center">
                        <h1 class="m-0 list-name">${expenseArr[i].expenseTitle}</h1>
                    </div>
                    <div style="width: 33%;" class="d-flex justify-content-center align-items-center">
                        <h2 class="m-0 text-center list-price">$${expenseArr[i].expenseAmount}</h2>
                    </div>
                    <div style="width: 33%;" class="d-flex justify-content-center align-items-center">
                        <div class="d-flex justify-content-center">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                </div>
        `
    }




    // edit function
    const editBtn = document.querySelectorAll('.fa-pen-to-square');
    editBtn.forEach((item, index) => {
        item.addEventListener('click', async () => {
            const edited = +prompt('Edit Amount!', expenseArr[index].expenseAmount);
            const updateRef = doc(db, "expenses", expenseArr[index].id);
            await updateDoc(updateRef, {
                expenseAmount: edited
            });
            expenseArr[index].expenseAmount = edited;
            renderExpense();
        })
    })




    // delete function
    const dltBtn = document.querySelectorAll('.fa-trash-can');
    dltBtn.forEach((item, index) => {
        item.addEventListener('click', async () => {
            await deleteDoc(doc(db, "expenses", expenseArr[index].id));
            console.log('document dlt with id ==>', expenseArr[index].id);
            expenseArr.splice(index, 1)
            renderExpense();
        })
    })
}


// calculates Total Amount
function totalAmountCalc() {
    totalAmount = expenseArr.reduce((accumulator, currentExpense) => {
        return accumulator + currentExpense.expenseAmount;
    }, 0);
    totalAmountWrapper.innerHTML = `$${totalAmount}`
}



// sort by time
sort.addEventListener('click', async () => {
    auth.onAuthStateChanged(async user => {
        if (user) {
            const uid = user.uid;
            const q = query(collection(db, "expenses"), where("uid", "==", uid), orderBy("time", "desc"));
            const querySnapshot = await getDocs(q);
            expenseArr = [];
            querySnapshot.forEach((doc) => {
                expenseArr.push({
                    expenseTitle: doc.data().expenseTitle,
                    expenseAmount: Number(doc.data().expenseAmount),
                    time: doc.data().time,
                    id: doc.id
                });
            });
            renderExpense();
        } else {
            console.log("No user signed in");
        }
    });
})



// sort by Amount
sortAmount.addEventListener('click', async () => {
    auth.onAuthStateChanged(async user => {
        if (user) {
            const uid = user.uid;
            const q = query(collection(db, "expenses"), where("uid", "==", uid), orderBy("expenseAmount", "desc"));
            const querySnapshot = await getDocs(q);
            expenseArr = [];
            querySnapshot.forEach((doc) => {
                expenseArr.push({
                    expenseTitle: doc.data().expenseTitle,
                    expenseAmount: Number(doc.data().expenseAmount),
                    time: doc.data().time,
                    id: doc.id
                });
            });
            renderExpense();
        } else {
            console.log("No user signed in");
        }
    });
})


// signout functionality
signOutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location = 'login.html'
    }).catch((error) => {
        alert(error)
    });
})