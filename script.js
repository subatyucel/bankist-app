'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Functions
function displayMovements(movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance}€`;
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => (int >= 1 ? acc + int : acc));
  labelSumInterest.textContent = interest;
}

function createUsernames(accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((word) => word[0])
      .join('');
  });
}
createUsernames(accounts);

function updateUI(acc) {
  //display movements
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summay
  calcDisplaySummary(acc);
}

//Event handlers
let currentAcc;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    //Clear inputs
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    //Display Ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';

    //Update UI
    updateUI(currentAcc);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    recieverAcc &&
    currentAcc.balance >= amount &&
    recieverAcc.username !== currentAcc.username
  ) {
    //Transfer and update ui
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAcc);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const i = accounts.findIndex((acc) => acc.username === currentAcc.username);

    accounts.splice(i, 1);

    containerApp.style.opacity = 0;
  } else {
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();
  }
});
