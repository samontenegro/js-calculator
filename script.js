// Display and Keyboard Functions

function addBar() {
	let adv_bar = document.createElement('div');
	adv_bar.classList.add('calc-adv');
	let tag = document.createElement('p');
	adv_bar.appendChild(tag);
	adv_bar.firstChild.textContent = '· · ·';
	keyboard.appendChild(adv_bar);
}

function keyMaker (num) {
	let key = document.createElement('div');
	key.classList.add('key','num');
	key.setAttribute('id',`Digit${num}`);
	key.setAttribute('data-symbol',`${num}`);
	let number = document.createElement('p');
	number.textContent = `${num}`;	
	key.appendChild(number);
	return key
}

function pushKeys () {
	for (i=9;i>0;i--) {
		keypad.appendChild(keyMaker(i));
	}
}

function pushStream(x) {
	stream = stream + `${x}`;
	stack[0] = stream;
	pushStack();
}

function pushStreamSingle (x) {
	if (!stream.includes(`${x}`)) {
	stream = stream + `${x}` + "";
	stack[0] = stream;
	pushStack();
	}
}

function pushStack() {
	for (x in stack) {
		disp[2-x].firstChild.textContent = stack[x];
	}
}

function shiftStack() {
	stack.unshift('0');
	stack.pop();
	stream = '';
	pushStack();
}

function clearAll () {
	stream = '';
	stack = ['0','',''];
	pushStack();
}

function clearStream() {
	stream = '';
	stack[0] = '0';
	pushStack();
}

function compError() {
	op = ''
	clearAll();
	stack[0] = 'err';
	shiftStack();
	pushStack();	
}

function numFormat (x) {
	if (Math.abs(parseFloat(x)) < 0.000001) {
		return x.toPrecision(8)
	} else {return x}
}

// Mathematical Operations

function add (a,b) {
	return parseFloat(a)+parseFloat(b)
}

function subtract (a,b) {
	return parseFloat(a)-parseFloat(b)
}

function multiply (a,b) {
	return parseFloat(a)*parseFloat(b)
}

function divide (a,b) {
	if (parseFloat(b) !== 0) {return parseFloat(a)/parseFloat(b)} else {
		return 'err'
	}
}

function sin (a) {
	return Math.sin(a)
}

function cos (a) {
	return Math.cos(a)
}

let ops = {add,subtract,multiply,divide,sin,cos}

const keyboard = document.querySelector('.calc-keyboard');
const keypad = keyboard.querySelector('.calc-keypad');
const disp = document.querySelectorAll('.calc-stack');

let stream = '';
let stack = ['0','',''];
let op = '';


// Event functions

function unary_event (e) {
	if (op) {
		compError();
	} else {
		stack[0] = numFormat(ops[e.currentTarget.id](stack[0])).toString().substring(0,13);
		stream = '';
		pushStack();
	}
}

function binary_event (e) {
	if (!op) {
		shiftStack();
		op = e.currentTarget.id;
	} else {
		compError();
	}
}

function result_event (e) {
	if (stack[1] === '' || stack[1] === 'err') {
		compError();
	} else {
		let val = ops[op](stack[1],stack[0]).toString().substring(0,13);
		clearAll();
		stack[0] = val;
		pushStack();
		op = '';
	}
}

// Initialization

addBar();
pushKeys();
pushStack();

// Constant references to DOM elements

const numkeys = document.querySelectorAll('.num, .zero');
const period = document.querySelector('#period');
const ce = document.querySelector('#ce');
const c = document.querySelector('#c');
const unary_ops = document.querySelectorAll('#sin, #cos');
const binary_ops = document.querySelectorAll('#add, #subtract, #multiply, #divide');
const result = document.querySelector('#result');

// Click event listeners

numkeys.forEach(function (x){
	x.addEventListener('click', (e) => {pushStream(e.currentTarget.getAttribute('data-symbol'))})
});

unary_ops.forEach(function (x){
	x.addEventListener('click', (e) => unary_event(e))
});

binary_ops.forEach(function (x) {
	x.addEventListener('click', (e) => binary_event(e))
});

result.addEventListener('click', (e) => result_event(e));

period.addEventListener('click', (e) => {pushStreamSingle(e.currentTarget.getAttribute('data-symbol'))})
ce.addEventListener('click',() => {clearAll()});
c.addEventListener('click',() => {clearStream()});

// Keydown event listener

window.addEventListener('keydown', function (e) {
	key = e.key;
	digit = document.querySelector(`#${e.code}`);
	if (digit) {pushStream(digit.getAttribute('data-symbol'))}
	else if (key === '.') {pushStreamSingle('.')} 
	else if (key === 'c') {clearStream()}
	else if (key === 'Enter') {result_event(e)}
	else if (key === '+') {binary_event({currentTarget: {id: 'add'}})}
	else if (key === '-') {binary_event({currentTarget: {id: 'subtract'}})}
	else if (key === '*') {binary_event({currentTarget: {id: 'multiply'}})}		
});