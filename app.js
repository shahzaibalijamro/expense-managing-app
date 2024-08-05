import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"; 

import { db } from "./config.js";

const form = document.querySelector('#form');
const inputTitle = document.querySelector('.input-title');
const inputAmount = document.querySelector('.input-amount');
const totalAmountWrapper = document.querySelector('.total-amount-2');
const listWrapper = document.querySelector('.list-wrapper-out');
const expenseArr = [];
let totalAmount;



// value sumbition
form.addEventListener('submit', event => {
    event.preventDefault();
    addExpense();
})



// pushing data to firestore and array
async function addExpense() {
    let toNumber = Number(inputAmount.value);
    try {
        const docRef = await addDoc(collection(db, "expenses"), {
            expenseTitle: inputTitle.value,
            expenseAmount: toNumber,
            time: Timestamp.fromDate(new Date())
        });
        expenseArr.push({
            expenseName: inputTitle.value,
            expenseAmount: toNumber,
            docId : docRef.id
        })
        console.log("Document written with ID: ", docRef.id);
        inputTitle.value= '';
        inputAmount.value= '';
        console.log(expenseArr);
        renderExpense();
        totalAmountCalc()
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}




// rendering data on the screen 
function renderExpense() {
    listWrapper.innerHTML = '';
    for (let i = 0; i < expenseArr.length; i++) {
        listWrapper.innerHTML += `
        <div class="d-flex justify-content-center list-wrapper-in w-100">
                    <div class="list-style-left">
                    </div>
                    <div style="width: 33%;" class="d-flex align-items-center">
                        <h1 class="m-0 list-name">${expenseArr[i].expenseName}</h1>
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
    editBtn.forEach((item,index)=>{
        item.addEventListener('click',()=>{
            const edited = prompt('Edit Amount!', expenseArr[index].expenseAmount);
            expenseArr[index].expenseAmount = edited;
            renderExpense();
        })
    })




    // delete function
    const dltBtn = document.querySelectorAll('.fa-trash-can');
    dltBtn.forEach((item,index)=>{
        item.addEventListener('click',()=>{
            expenseArr.splice(index,1)
            renderExpense();
        })
    })
}

function editExpense(index) {
    const edited = prompt('Edit Amount!', amountArr[index]);
    amountArr.splice(index,1,edited);
    renderExpense();
}

function dltExpense(index) {
    amountArr.splice(index,1);
    description.splice(index,1);
    renderExpense();
}

function totalAmountCalc() {
    totalAmount = expenseArr.reduce((accumulator, currentExpense) => {
        return accumulator + currentExpense.expenseAmount;
    }, 0);
    totalAmountWrapper.innerHTML = `$${totalAmount}`
}