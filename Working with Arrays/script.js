'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
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

const displyMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${mov > 0 ? 'deposit' : 'withdrawal'}">${i + 1} ${mov > 0 ? 'deposit' : 'withdrawal'}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
const updateUI = function (acc) {
  displyMovements(acc.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${expenses}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reverseAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reverseAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reverseAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displyMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
// SLICE
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
//console.log(arr.splice(2));
console.log(arr.splice(-1));
console.log(arr);

//use mdn to learn more about array methods

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2.reverse());

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);

//JOIN
console.log(letters.join(' - '));

const arr = [23, 11, 64];
console.log(arr.at(0));
// getting the last element of the array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
console.log('--- FOREACH ---');

movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
});



//MAP


currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//SETS
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

//challenge 1

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice(1, -2);
  const doges = dogsJuliaCorrected.concat(dogsKate);
  doges.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};

const julia1 = [3, 5, 2, 12, 7];
const kate1 = [4, 1, 15, 8, 3];
checkDogs(julia1, kate1);

// the map method

const eurToUsd = 1.1;
const movementUsd = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementUsd);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
// THE REDUCE METHOD
// ACCUMULATOR -> SNOWBALL
const balance = movements.reduce(function (acc, cur, i, arr) {
  return acc + cur;
});
console.log(balance);


//challenge 2

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
};




const euroToUsd = 1.1;
const totalDepositesUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositesUSD);

const calcAverageHumanAge = function (ages) {
  return ages
 .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
 .filter(age => age >= 18)
 .reduce((acc, age , i , arr) => acc + age / arr.length,0)
 
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));


const firstWithdrwal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrwal);

let acc;
for (const i of accounts) {
  if (i.owner === 'Jessica Davis') {
    acc = i;
    break;
  }
}
console.log(acc);
let currentAccount;


const largeMovement = movements.findLast(mov => 
Math.abs(mov)>100
);
console.log(`Your lastet large movment ${largeMovement}`)
console.log(movements.includes(-130));

//some

const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

//EVERY

console.log(movements.every(mov => mov > 0));

//flat

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements.flat().reduce((acc, mov) => acc + mov, 0));


//challenge 4

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

//1.
const huskyWeight = breeds.find(h => h.breed === 'Husky').averageWeight;
console.log(huskyWeight);

//2.
const dogBothActivities = breeds.find(
  h => h.activities.includes('fetch') && h.activities.includes('running'),
);
console.log(dogBothActivities);

//3.
const allActivities = breeds.flatMap(breeds => breeds.activities);
console.log(allActivities);

//4.
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

//5.
const activitiesSwimminng = breeds
  .filter(b => b.activities.includes('swimming'))
  .flatMap(b => b.activities)
  .filter(act => act !== 'swimming');
console.log(activitiesSwimminng);

//6.

const breedsWeight = breeds.every(b => b.averageWeight >= 10);
console.log(breedsWeight);

//7.

const breedsActivities = breeds.some(b => b.activities.length >= 3);
console.log(breedsActivities);


// SORT
//STRING
const owners = ['Eman', 'omar', 'Ahmed', 'Doaa', 'Mariam'];
console.log(owners.sort());

//NUMBERS
console.log(movements);

//return < 0 , A, B
//return > 0  , B, A
movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});
console.log(movements);


//Array Grouping

console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'whithdrawals',
);
console.log(groupedMovements);

const groupedByActive = Object.groupBy(accounts, acc => {
  const movementCount = acc.movements.length;
  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});

console.log(groupedByActive);


//Emprty arrays + fill method
const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

x.fill(23, 2, 6);
console.log(x);

//Arry.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

//non-destructive alternative : toReversed , toSorted , toSpliced , with
const arr = [1, 2, 3, 4, 5];
const reversedArr = arr.toReversed();
console.log(reversedArr);
console.log(arr);
*/
