const form = document.querySelector('#form');
const input1 = document.querySelector('#input1');
const input2 = document.querySelector('#input2');
const descriptionWrapper = document.querySelector('#description-wrapper');
const amountWrapper = document.querySelector('#amount-wrapper');
const buttonsWrapper = document.querySelector('#buttons-wrapper');
const description = [];
const amountArr = [];
const totalAmountWrapper = document.querySelector('#totalamount-wrapper');
let totalAmount;
form.addEventListener('submit', event => {
    event.preventDefault();
    console.log(545);
    addExpense();
    localStorage.setItem('localDesc',JSON.stringify(description));
    localStorage.setItem('ls',JSON.stringify(description));
})

function addExpense() {
    let toNumber = Number(input2.value);
    description.push(input1.value);
    amountArr.push(toNumber);
    input1.value= '';
    input2.value= '';
    renderExpense();
    totalAmountCalc();
}

function renderExpense() {
    descriptionWrapper.innerHTML = '<h2>Description</h2>';
    amountWrapper.innerHTML = '<h2>Amount</h2>';
    buttonsWrapper.innerHTML = '<h2>Edit/Dlt</h2>';
    for (let i = 0; i < description.length; i++) {
        descriptionWrapper.innerHTML += `
        <p>${description[i]}</p>
        `
        amountWrapper.innerHTML += `
        <p>${amountArr[i]}</p>
        `
        buttonsWrapper.innerHTML += `
        <p>
        <button onclick="editExpense(${i})">Edit</button>
        <button onclick="dltExpense(${i})">Delete</button>
        </p>
        `
    }
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
    totalAmount = amountArr.reduce((accumulator,currentvalue)=>{
        return accumulator+currentvalue
    },0);
    totalAmountWrapper.innerHTML = `
    <h1>Total Amount = ${totalAmount}</h1>
    `
}