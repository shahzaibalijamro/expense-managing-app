const form = document.querySelector('#form');
const input1 = document.querySelector('#input1');
const input2 = document.querySelector('#input2');
const totalAmountWrapper = document.querySelector('.total-amount-2');
const listWrapper = document.querySelector('.list-wrapper-out');
const expenseArr = [];
let totalAmount;
form.addEventListener('submit', event => {
    event.preventDefault();
    console.log(input1.value);
    console.log(input2.value);
    // addExpense();
    // localStorage.setItem('localDesc',JSON.stringify(description));
    // localStorage.setItem('ls',JSON.stringify(description));
})

function addExpense() {
    console.log(input1.value);
    console.log(input2.value);
    // let toNumber = Number(input2.value);
    // expenseArr.push({
    //     expenseName: input1.value,
    //     expenseAmount: toNumber
    // })
    // input1.value= '';
    // input2.value= '';
    // renderExpense();
    // totalAmountCalc();
}

function renderExpense() {
    for (let i = 0; i < expenseArr.length; i++) {
        listWrapper.innerHTML += `
        <div class="d-flex justify-content-center list-wrapper-in w-100">
                    <div class="list-style-left">
                    </div>
                    <div style="flex-grow: 1;" class="d-flex align-items-center">
                        <h1 class="m-0 list-name">Food</h1>
                    </div>
                    <div style="flex-grow: 1;" class="d-flex justify-content-center align-items-center">
                        <h2 class="m-0 text-center list-price">$50</h2>
                    </div>
                    <div style="flex-grow: 1;" class="d-flex justify-content-center align-items-center">
                        <div class="d-flex justify-content-center">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                </div>
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