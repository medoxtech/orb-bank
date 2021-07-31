"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: "Steven Thomas Williams",
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: "Sarah Smith",
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sorted = false) {
	containerMovements.innerHTML = "";

	const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach((movement, index) => {
		const type = movement > 0 ? "deposit" : "withdrawal";
		const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
			index + 1
		} ${type}</div>
        <div class="movements__value">${movement}</div>
      </div>
    `;
		containerMovements.insertAdjacentHTML("afterbegin", html);
	});
};

const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
	labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
	const incomes = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, cur) => acc + cur, 0);
	labelSumIn.textContent = `${incomes}€`;

	const out = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, cur) => acc + cur, 0);
	labelSumOut.textContent = `${Math.abs(out)}€`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int) => int >= 1)
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = `${interest}€`;
};

function createUserName(accs) {
	accs.forEach((acc) => {
		acc.username = acc.owner
			.toLowerCase()
			.split(" ")
			.map((name) => name[0])
			.join("");
	});
}

createUserName(accounts);

const updateUI = function (acc) {
	// display the current account movement
	displayMovements(acc.movements);
	// display cirrent account balance
	calcDisplayBalance(acc);
	// display current account summary
	calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

btnLogin.addEventListener("click", function (e) {
	// prevent form from submitting
	e.preventDefault();

	// get the current user using the username
	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);

	//check the pin if corrent to log in
	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		containerApp.style.opacity = "1";

		//update welcome massege
		labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;

		//clear input field
		inputLoginUsername.value = "";
		inputLoginPin.value = "";

		// lose focus from the input
		inputLoginPin.blur();

		updateUI(currentAccount);
	}
});

btnTransfer.addEventListener("click", function (e) {
	//prevent default behaviour
	e.preventDefault();

	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);

	inputTransferAmount.value = inputTransferTo.value = "";

	if (
		amount > 0 &&
		receiverAcc &&
		currentAccount.balance >= amount &&
		receiverAcc?.username !== currentAccount.username
	) {
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);
		inputTransferAmount.blur();
		inputTransferTo.blur();
		updateUI(currentAccount);
	}
});

btnClose.addEventListener("click", function (e) {
	e.preventDefault();

	if (
		currentAccount.username === inputCloseUsername.value &&
		currentAccount.pin === Number(inputClosePin.value)
	) {
		const accountIndex = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);
		accounts.splice(accountIndex, 1);
		containerApp.style.opacity = 0;
		labelWelcome.textContent = "Log in to get started";
		inputCloseUsername.value = inputClosePin.value = "";
	}
});

btnLoan.addEventListener("click", function (e) {
	e.preventDefault();

	const loanAmount = Number(inputLoanAmount.value);
	inputLoanAmount.textContent = "";

	if (
		loanAmount > 0 &&
		currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
	) {
		currentAccount.movements.push(loanAmount);
		updateUI(currentAccount);
	}
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
	e.preventDefault();

	sorted = !sorted;

	displayMovements(currentAccount.movements, sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
	["USD", "United States dollar"],
	["EUR", "Euro"],
	["GBP", "Pound sterling"],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ["a", "b", "c", "d", "q"];

// SLICE
//create new array
// console.log(arr.slice(3)); // d q
// console.log(arr.slice(12)); // empty array
// console.log(arr.slice(0)); // all
// console.log(arr.slice(2)); // c d q
// console.log(arr.slice(0, -1)); // all except the last
// console.log(arr.slice(1, -3)); // b

// SPLECE
// the splice mutate the original array
// work the same way like slice

// let arr1 = ["a", "d", "c", "d", "4"];

// REVERSE()
// this method reverse the original array element
// console.log(arr1.reverse());
// console.log(arr1);

//CONCAT
// concatinate two arrays
// console.log(arr.concat(arr1));
// this method doesn't mutate the original array just like usning the sprade operator
// console.log([...arr, ...arr1]);

//join return a string and it join all the array elemt in one spring
// console.log(arr.join(" * "));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// the continue and brak key words doesn't work in foreach

// movements.forEach(function(currentElement, index, theintireArray){
//   // code
// });
// forEach work the same way with Map in callback function the arguments order is (value, key, entire Map)
//
//map

// filter

// reduce
