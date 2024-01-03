const inputDisplay = document.querySelector("#history");
const outputDisplay = document.querySelector("#result");

const clearButton = document.querySelector("[data-all-clear]");
const negateButton = document.querySelector("[data-negation]");
const percentButton = document.querySelector("[data-percent]");
const operationButtons = document.querySelectorAll("[data-operator]");
const numberButtons = document.querySelectorAll("[data-number]");
const decimalButton = document.querySelector("[data-decimal]");
const equalsButton = document.querySelector("[data-equals]");

// Define variables to store the current and previous values and the current operation
let currentInput = "";
let wholeEquation = ""
let previousInput = "";
let result = "0"
let currentOperation = null;

// Function to update the display with the current input
function updateDisplay() {
  inputDisplay.value = wholeEquation;
  outputDisplay.value = result;
}

// Function to handle number button clicks
function handleNumberClick(number) {
    if (wholeEquation.length <= 15) {
        if (previousInput === "") {
            previousInput = number.toString();
            wholeEquation = number.toString();
        } 
        else if (previousInput !== "" && currentOperation == null) {
            previousInput += number.toString();
            wholeEquation += number.toString();
        }
        else {
            currentInput += number.toString();
            wholeEquation += number.toString();
        }
        updateDisplay();
    }
}

// Function to handle operator button clicks
function handleOperatorClick(operator) {
    if (previousInput != "" && currentOperation == null && wholeEquation.length <= 15) {
        currentOperation = operator;
        wholeEquation += " " + operator + " ";
        updateDisplay();
    }
    else if (previousInput != "" && currentOperation != null) {
        currentOperation = operator;
        wholeEquation = previousInput + " " + operator + " ";
        updateDisplay();
    }
}

// Calculates the numbers above
function calculate() {
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);
    switch (currentOperation) {
      case "+":
        result = (num1 + num2);
        break;
      case "-":
        result = (num1 - num2);
        break;
      case "*":
        result = (num1 * num2);
        break;
      case "/":
        if (num2 !== 0) {
          result = (num1 / num2);
        } else {
          result = "Error";
        }
        break;
      default:
        break;
    }
    if (result != Math.floor(result)) {
        result = parseFloat(result).toFixed(2);
    }

    if (result.length >= 8) {
        result = parseFloat(result).toExponential(2);
    }

    currentOperation = null;
    currentInput = "";
    previousInput = result;
    wholeEquation = result.toString();
    if (result == "Error" || isNaN(result)) {
        previousInput = "";
        wholeEquation = "0";
        result = "Error";
    }
    updateDisplay();
  }

  // Clears everything and resets calculator
  function clearAll() {
    currentInput = "";
    wholeEquation = ""
    previousInput = "";
    result = "0"
    currentOperation = null;
    updateDisplay();
  }

  // Negates the number
  function handleNegationClick() {
    if (previousInput !== "" && currentOperation == null) {
        previousInput = (parseFloat(previousInput) * -1).toString();
        wholeEquation = previousInput;
    }
    else if (previousInput !== "" && currentOperation != null && currentInput !== "") {
        currentInput = (parseFloat(currentInput) * -1).toString();
        wholeEquation = previousInput + " " + currentOperation + " " + currentInput;
    }

    updateDisplay();
  }

  // Converts number to a percent
  function handlePercentClick() {
    if (previousInput !== "" && currentOperation == null) {
        previousInput = (parseFloat(previousInput) / 100).toString();
        wholeEquation = previousInput;
    }
    else if (previousInput !== "" && currentOperation != null && currentInput !== "") {
        currentInput = (parseFloat(currentInput) / 100).toString();
        wholeEquation = previousInput + " " + currentOperation + " " + currentInput;
    }

    updateDisplay();
  }

  // Adds a decimal point
  function handleDecimalClick() {
    if (previousInput !== "" && previousInput.indexOf(".") == -1 && currentOperation == null) {
        previousInput += ".";
        wholeEquation = previousInput;
    }
    else if (previousInput !== "" && currentOperation != null && currentInput !== "" && currentInput.indexOf(".") == -1) {
        currentInput += ".";
        wholeEquation = previousInput + " " + currentOperation + " " + currentInput;
    }

    updateDisplay();
  }


numberButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        let {target} = event;
        handleNumberClick(target.dataset.number);
    })
})

operationButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        let {target} = event;
        handleOperatorClick(target.dataset.operator);
    });
  });

clearButton.addEventListener("click", () => {
    clearAll();
})

equalsButton.addEventListener("click", () => {
    calculate();
})

negateButton.addEventListener('click', () => {
    handleNegationClick();
})

percentButton.addEventListener('click', () => {
    handlePercentClick();
})

decimalButton.addEventListener('click', () => {
    handleDecimalClick();
})


// Keyboard listeners
document.addEventListener('keydown', (event) => {
    if (!isNaN(event.key)) {
        handleNumberClick(event.key);
    }
    if (event.key == ".") {
        handleDecimalClick();
    }

    if (["+", "-", "/", "*"].includes(event.key)) {
        handleOperatorClick(event.key);
    }

    if (event.key == "%") {
        handlePercentClick();
    }

    if (event.key == "Enter" || event.key == "=") {
        calculate();
    }

    if (event.key == "Backspace") {
        clearAll();
    }
})