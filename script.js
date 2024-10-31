const calculatorHistory = document.getElementById("calculatorHistory");
const calculatorInput = document.getElementById("calculatorInput");
const mathElements = Array.from(document.getElementsByClassName("mathElement"));
const calculatorButtons = Array.from(document.getElementsByClassName("calculatorButton"));
const getResult = document.getElementById("getResult");

const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/", "*", "-", "+", ".", ",", "(", ")"];

calculatorInput.addEventListener('keypress', function(event) {
    if(!keys.includes(event.key)) { 
        event.preventDefault(); 
    }
    if (event.key === ',') {
        event.preventDefault(); 
        calculatorInput.value += ".";
    }
    if (/([*/+\-.]{2})$/.test(calculatorInput.value + event.key)) {
        event.preventDefault();
    }
});

mathElements.forEach(mathElement => {
    mathElement.addEventListener('click', function () {
        calculatorInput.value += mathElement.textContent;
    });
});

calculatorButtons.forEach(calculatorButton => {
    calculatorButton.addEventListener('click', function () {
        calculatorInput.focus();
    });
});

getResult.addEventListener('click', Calculate);

document.addEventListener('keyup', function(e) {
    if (e.code === 'Enter' || e.code === 'Equal') {
        Calculate();
    }
});

const deleteOneChar = document.getElementById('deleteOneChar');
const deleteAllChars = document.getElementById('deleteAllChars');

deleteOneChar.addEventListener('click', function(){
    calculatorInput.value = calculatorInput.value.slice(0, -1);
});

deleteAllChars.addEventListener('click', function() {
    calculatorInput.value = "";
});

let expression = "";
let result = 0;

function addHistory() {
    const divExpr = document.createElement('div');
    divExpr.classList.add("expressionAtHistory");
    calculatorHistory.appendChild(divExpr);
    divExpr.append(expression);

    const divRes = document.createElement('div');
    divRes.classList.add("resultAtHistory");
    calculatorHistory.appendChild(divRes);
    divRes.append("= " + result);
    calculatorInput.value = result;
    calculatorHistory.scrollTop = calculatorHistory.scrollHeight;
}

function Calculate() {
    if (calculatorInput.value[0] == "/" || calculatorInput.value[0] == "*" || 
        calculatorInput.value[0] == "-" || calculatorInput.value[0] == "+") {
        calculatorInput.value = "0" + calculatorInput.value;
    }
    if (calculatorInput.value.slice(-1) == "/" || calculatorInput.value.slice(-1) == "*" || 
    calculatorInput.value.slice(-1) == "-" || calculatorInput.value.slice(-1) == "+") {
        calculatorInput.value = calculatorInput.value.slice(0, -1);
    }
    for (let i = 0; i < calculatorInput.value.length - 1; i++) {
        if (calculatorInput.value[i] === '(' && (calculatorInput.value[i + 1] === '+' || calculatorInput.value[i + 1] === '-')) {
            calculatorInput.value = calculatorInput.value.slice(0, i + 1) + "0" + calculatorInput.value.slice(i + 1);
        }
    }
    expression = calculatorInput.value;

    try {
        result = evaluate(expression);
        if (isNaN(result) || !isFinite(result)) {
            alert("Ошибка в выражении");
        }
        else {
            addHistory();
        }
    } 
    catch (error) {
        alert("Ошибка в выражении");
    }
}

function evaluate(expr) {
    let { result } = parseExpression(expr, 0);
    return result;
}

function parseExpression(expr, index) {
    let values = [];
    let operators = [];
    let num = '';
    
    while (index < expr.length) {
        let char = expr[index];
        
        if (/\d/.test(char) || char === '.') { 
            num += char;
        } 
        else {
            if (num) {
                values.push(parseFloat(num));
                num = '';
            }
            if (char === '(') { 
                let parsed = parseExpression(expr, index + 1);
                values.push(parsed.result);
                index = parsed.index;
            } 
            else if (char === ')') {
                break;
            } 
            else if ("+-*/".includes(char)) {  
                while (operators.length && precedence(operators[operators.length - 1]) >= precedence(char)) {
                    processOperation(values, operators.pop());
                }
                operators.push(char);
            }
        }
        index++;
    }
    
    if (num) {
        values.push(parseFloat(num));
    }

    while (operators.length) {
        processOperation(values, operators.pop());
    }

    return { result: values.pop(), index };
}

function precedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
}

function processOperation(values, operator) {
    const b = values.pop();
    const a = values.pop();
    switch (operator) {
        case '+': values.push(a + b); break;
        case '-': values.push(a - b); break;
        case '*': values.push(a * b); break;
        case '/': values.push(a / b); break;
    }
}