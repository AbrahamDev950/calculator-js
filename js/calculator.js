const display = document.querySelector(".display");

let firstNumber = null;
let operator = null;
let waitingSecondNumber = false;

/* Shows the number but validates its length*/
function setDisplay(value) {
    if (display.tagName === "INPUT") {
        display.value = validateDisplay(value.toString());
    }
}

/* return current value */
function getDisplay() {
    return display.value;
}

/* Remove last number */
function removeDigit(currentNumber) {
    const result = currentNumber.slice(0, -1);
    return result === "" || result === "-" ? "0" : result;
}

/* Max length allowed: 10 digits */
function validateDisplay(currentNumber) {
    if (currentNumber.length > 10) {
        alert("The number is too long. Please enter a shorter number.");
        return currentNumber.slice(0, 10);
    }
    return currentNumber;
}

/*
 * Central function which resolves the operation
 * op: "+", "-", "*", "/", "√"
 * a: first number ("√" has a special case)
 * b: second number
 */
function operate(op, a, b) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            /*When second number is 0 throw an alert*/
            if (b === 0) {
                alert("This operation is not allowed.");
                return 0;
            }
            return a / b;
        case "√":
            if (b < 0) {
                alert("This operation is not allowed.");
                return 0;
            }
            return Math.sqrt(b);
        default:
            return b;
    }
}

/*
 * Handles operators(+, -, *, /, √).
 * "√" just needs a number, therefore it calculates on it.
 * The rest need two numbers for calculating the result.
 */
function handleOperator(op) {
    const currentValue = Number(getDisplay());

    if (op === "√") {
        const result = operate("√", null, currentValue);
        setDisplay(result.toString());
        // The result will be the first number in case the user needs to use it.
        firstNumber = result;
        waitingSecondNumber = true;
        return;
    }
    // Validates if there is an operation to do, then calculate the result 
    if (operator && waitingSecondNumber === false) {
        const result = operate(operator, firstNumber, currentValue);
        setDisplay(result.toString());
        firstNumber = result;
    } else {
        firstNumber = currentValue;
    }

    operator = op;
    waitingSecondNumber = true;
}

function handleEqual() {
    if (operator === null || waitingSecondNumber) {
        return;
    }
    const secondNumber = Number(getDisplay());
    const result = operate(operator, firstNumber, secondNumber);

    setDisplay(result.toString());
    firstNumber = null;
    operator = null;
    waitingSecondNumber = false;
}


function handleFunction(buttonValue) {
    if (buttonValue === "C") {
        setDisplay("0");
        firstNumber = null;
        operator = null;
        waitingSecondNumber = false;
    } else if (buttonValue === "+/-") {
        const current = getDisplay();
        setDisplay(current.startsWith("-") ? current.slice(1) : "-" + current);
    } else if (buttonValue === "del") {
        setDisplay(removeDigit(getDisplay()));
    }
}

/*User can use dot function one time*/
function handleDot() {
    const current = getDisplay();
    if (!current.includes(".")) {
        setDisplay(current + ".");
    }
}

/*Handles inputs events from user, it knows wheter if 
*it's the first time user adds information
* or if the second number is "0" or an input value
*/
function handleNumber(buttonValue) {
    if (waitingSecondNumber) {
        setDisplay(buttonValue);
        waitingSecondNumber = false;
    } else if (getDisplay() === "0") {
        setDisplay(buttonValue);
    } else {
        setDisplay(getDisplay() + buttonValue);
    }
}

/* Identifies by listening what class of buttons it is, such as:
* "number", "function", "equal", etc.
*/
document.querySelectorAll(".buttons button").forEach((button) => {
    button.addEventListener("click", () => {
        const buttonValue = button.textContent.trim();

        if (button.classList.contains("button-number")) {
            handleNumber(buttonValue);
        } else if (button.classList.contains("button-operator")) {
            handleOperator(buttonValue);
        } else if (button.classList.contains("button-equal")) {
            handleEqual();
        } else if (button.classList.contains("button-function")) {
            handleFunction(buttonValue);
        } else if (button.classList.contains("button-dot")) {
            handleDot();
        }
    });
});