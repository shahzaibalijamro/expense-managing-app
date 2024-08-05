const form = document.querySelector('#form');
const inputTitle = document.querySelector('.input-title');
const inputAmount = document.querySelector('.input-amount');
const totalAmountWrapper = document.querySelector('.total-amount-2');
const listWrapper = document.querySelector('.list-wrapper-out');
const expenseArr = [];
let totalAmount;
form.addEventListener('submit', event => {
    event.preventDefault();
    addExpense();
    // localStorage.setItem('localDesc',JSON.stringify(description));
    // localStorage.setItem('ls',JSON.stringify(description));
})

function addExpense() {
    let toNumber = Number(inputAmount.value);
    expenseArr.push({
        expenseName: inputTitle.value,
        expenseAmount: toNumber
    })
    inputTitle.value= '';
    inputAmount.value= '';
    console.log(expenseArr);
    renderExpense();
    // totalAmountCalc();
}

function renderExpense() {
    listWrapper.innerHTML = '';
    for (let i = 0; i < expenseArr.length; i++) {
        listWrapper.innerHTML += `
        <div class="d-flex justify-content-center list-wrapper-in w-100">
                    <div class="list-style-left">
                    </div>
                    <div style="width:33%;" class="d-flex align-items-center">
                        <h1 class="m-0 list-name">${expenseArr[i].expenseName}</h1>
                    </div>
                    <div style="width:33%;" class="d-flex justify-content-center align-items-center">
                        <h2 class="m-0 text-center list-price">$${expenseArr[i].expenseAmount}</h2>
                    </div>
                    <div style="width:33%;" class="d-flex justify-content-center align-items-center">
                        <div class="d-flex justify-content-center">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                </div>
        `
    }
    const editBtn = document.querySelectorAll('.fa-pen-to-square');
    editBtn.forEach((item,index)=>{
        item.addEventListener('click',()=>{
            const edited = prompt('Edit Amount!', expenseArr[index].expenseAmount);
            expenseArr[index].expenseAmount = edited;
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
    totalAmount = amountArr.reduce((accumulator,currentvalue)=>{
        return accumulator+currentvalue
    },0);
    totalAmountWrapper.innerHTML = `
    <h1>Total Amount = ${totalAmount}</h1>
    `
}