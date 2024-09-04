(function() {
    const calculator = {
        screen: document.querySelector('.screen'),
        buttons: document.querySelectorAll('.btn'),
        clearButton: document.querySelector('.btn-clear'),
        equalButton: document.querySelector('.btn-equal'),
        backspaceButton: document.querySelector('#backspace'),
        lastOperator: null,
        lastNumber: '',
    };

    function updateScreen(value) {
        resetScreenIfError();
        const currentNumber = getCurrentNumber();

        if (isRedundantZero(currentNumber, value)) return;
        if (isValidNumberReplacement(currentNumber, value)) replaceLeadingZero(value);
        else if (isOperator(value)) processOperator(value);
        else if (isDecimalPoint(value)) processDecimalPoint();
        else if (isPercentage(value)) applyPercentage();
        else appendToScreen(value);
    }

    function resetScreenIfError() {
        if (calculator.screen.value === "Error" || calculator.screen.value === "Please enter") {
            calculator.screen.value = '';
        }
    }

    function isRedundantZero(currentNumber, value) {
        return currentNumber === '0' && value === '0';
    }

    function isValidNumberReplacement(currentNumber, value) {
        return currentNumber === '0' && value !== '.' && !isOperator(value);
    }

    function replaceLeadingZero(value) {
        calculator.screen.value = calculator.screen.value.slice(0, -1) + value;
    }

    function processOperator(value) {
        if (calculator.screen.value === '' || isOperator(calculator.screen.value.slice(-1))) return;
        appendToScreen(value);
        updateLastOperator(value);
    }

    function isDecimalPoint(value) {
        return value === '.';
    }

    function processDecimalPoint() {
        if (calculator.screen.value === '' || isOperator(calculator.screen.value.slice(-1)) || !canAddDecimal()) return;
        appendToScreen('.');
    }

    function isPercentage(value) {
        return value === '%';
    }

    function appendToScreen(value) {
        calculator.screen.value += value;
    }

    function updateLastOperator(value) {
        calculator.lastOperator = value;
        calculator.lastNumber = calculator.screen.value.slice(0, -1);
    }

    function canAddDecimal() {
        const currentNumber = getCurrentNumber();
        return !currentNumber.includes('.');
    }

    function isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }

    function getCurrentNumber() {
        return calculator.screen.value.split(/[\+\-\*\/]/).pop();
    }

    function applyPercentage() {
        const currentNumber = getCurrentNumber();
        if (currentNumber) {
            const percentageValue = parseFloat(currentNumber) / 100;
            calculator.screen.value = calculator.screen.value.slice(0, -currentNumber.length) + percentageValue;
        }
    }

    function calculateResult() {
        if (calculator.screen.value === '') {
            calculator.screen.value = "Please enter";
            return;
        }

        try {
            if (isOperator(calculator.screen.value.slice(-1))) {
                calculator.screen.value = "Error";
            } else {
                let answer = eval(calculator.screen.value);
                answer = roundToPrecision(answer, 10);
                calculator.screen.value = answer;
                calculator.lastNumber = calculator.screen.value;
            }
        } catch (error) {
            calculator.screen.value = "Error";
        }
    }

    function roundToPrecision(value, precision) {
        return parseFloat(value.toFixed(precision));
    }

    function clearScreen() {
        calculator.screen.value = "";
        calculator.lastOperator = null;
        calculator.lastNumber = '';
    }

    function deleteLastCharacter() {
        calculator.screen.value = calculator.screen.value.slice(0, -1);
    }

    function attachEventListeners() {
        calculator.buttons.forEach(button => {
            button.addEventListener('click', e => {
                const value = e.target.dataset.num;
                if (value !== undefined) {
                    updateScreen(value);
                }
            });
        });

        calculator.equalButton.addEventListener('click', calculateResult);
        calculator.clearButton.addEventListener('click', clearScreen);
        calculator.backspaceButton.addEventListener('click', deleteLastCharacter);
    }

    function initCalculator() {
        attachEventListeners();
    }

    initCalculator();

})();