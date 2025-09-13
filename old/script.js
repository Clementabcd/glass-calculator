document.addEventListener('DOMContentLoaded', function() {
    // Calculator state
    const calculator = {
        displayValue: '0',
        previousValue: null,
        operation: null,
        waitingForOperand: false,
        currentMode: 'DEG', // DEG or RAD for trigonometric functions
        memoryValue: null
    };

    // DOM elements
    const display = document.querySelector('.current-operation');
    const previousDisplay = document.querySelector('.previous-operation');
    const buttons = document.querySelectorAll('.calculator button');

    // Update calculator display
    function updateDisplay() {
        display.textContent = calculator.displayValue;
        
        // Show previous operation if exists
        if (calculator.previousValue !== null && calculator.operation) {
            previousDisplay.textContent = `${calculator.previousValue} ${calculator.operation}`;
        } else {
            previousDisplay.textContent = '';
        }
    }

    // Input digit handler
    function inputDigit(digit) {
        const { displayValue, waitingForOperand } = calculator;

        if (waitingForOperand) {
            calculator.displayValue = digit;
            calculator.waitingForOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    // Input decimal handler
    function inputDecimal() {
        if (calculator.waitingForOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForOperand = false;
            return;
        }

        if (!calculator.displayValue.includes('.')) {
            calculator.displayValue += '.';
        }
    }

    // Handle operator buttons
    function handleOperator(nextOperator) {
        const { displayValue, previousValue, operation } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operation && calculator.waitingForOperand) {
            calculator.operation = nextOperator;
            return;
        }

        if (previousValue === null) {
            calculator.previousValue = inputValue;
        } else if (operation) {
            const currentValue = previousValue || 0;
            let result;
            
            switch (operation) {
                case '+':
                    result = currentValue + inputValue;
                    break;
                case '-':
                    result = currentValue - inputValue;
                    break;
                case '×':
                    result = currentValue * inputValue;
                    break;
                case '÷':
                    result = currentValue / inputValue;
                    break;
                case 'xʸ':
                    result = Math.pow(currentValue, inputValue);
                    break;
            }

            calculator.displayValue = String(result);
            calculator.previousValue = result;
        }

        calculator.waitingForOperand = true;
        calculator.operation = nextOperator;
    }

    // Handle scientific functions
    function handleScientificFunction(func) {
        const inputValue = parseFloat(calculator.displayValue);
        let result;
        
        switch (func) {
            case 'sin':
                result = calculator.currentMode === 'DEG' 
                    ? Math.sin(inputValue * Math.PI / 180) 
                    : Math.sin(inputValue);
                break;
            case 'cos':
                result = calculator.currentMode === 'DEG' 
                    ? Math.cos(inputValue * Math.PI / 180) 
                    : Math.cos(inputValue);
                break;
            case 'tan':
                result = calculator.currentMode === 'DEG' 
                    ? Math.tan(inputValue * Math.PI / 180) 
                    : Math.tan(inputValue);
                break;
            case 'log':
                result = Math.log10(inputValue);
                break;
            case 'ln':
                result = Math.log(inputValue);
                break;
            case '√':
                result = Math.sqrt(inputValue);
                break;
            case 'x²':
                result = Math.pow(inputValue, 2);
                break;
            case 'π':
                result = Math.PI;
                break;
            case 'ANS':
                if (calculator.memoryValue !== null) {
                    result = calculator.memoryValue;
                }
                break;
        }

        if (result !== undefined) {
            calculator.displayValue = String(result);
            calculator.waitingForOperand = true;
        }
    }

    // Handle special operations
    function handleSpecialOperation(op) {
        switch (op) {
            case 'AC':
                // All clear
                calculator.displayValue = '0';
                calculator.previousValue = null;
                calculator.operation = null;
                calculator.waitingForOperand = false;
                break;
            case 'DEL':
                // Delete last character
                if (calculator.displayValue.length === 1 || 
                    (calculator.displayValue.length === 2 && calculator.displayValue.startsWith('-'))) {
                    calculator.displayValue = '0';
                } else {
                    calculator.displayValue = calculator.displayValue.slice(0, -1);
                }
                break;
            case 'RAD':
                // Switch to radians mode
                calculator.currentMode = 'RAD';
                break;
            case 'DEG':
                // Switch to degrees mode
                calculator.currentMode = 'DEG';
                break;
            case '=':
                // Perform calculation
                if (calculator.operation && calculator.previousValue !== null) {
                    handleOperator('=');
                    calculator.memoryValue = parseFloat(calculator.displayValue);
                    calculator.operation = null;
                    calculator.previousValue = null;
                }
                break;
            case '(':
            case ')':
                // Parentheses (for future expansion)
                break;
        }
    }

    // Button click handler
    function handleButtonClick(event) {
        const { target } = event;
        const value = target.textContent;

        // Play subtle click sound (optional)
        // new Audio('click.wav').play().catch(e => {});

        // Add click animation
        target.classList.add('active');
        setTimeout(() => target.classList.remove('active'), 100);

        // Handle different button types
        if (target.classList.contains('function-btn')) {
            handleScientificFunction(value);
        } else if (target.classList.contains('operator-btn')) {
            handleOperator(value);
        } else if (target.classList.contains('equals-btn')) {
            handleSpecialOperation('=');
        } else if (value === '.') {
            inputDecimal();
        } else if (['AC', 'DEL', 'RAD', 'DEG', 'ANS', '(', ')'].includes(value)) {
            handleSpecialOperation(value);
        } else if (!isNaN(value)) {
            inputDigit(value);
        }

        updateDisplay();
    }

    // Keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Map keyboard keys to calculator functions
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': '.', '+': '+', '-': '-', '*': '×', '/': '÷',
            'Enter': '=', '=': '=', 'Backspace': 'DEL', 'Escape': 'AC',
            'p': 'π', 's': 'sin', 'c': 'cos', 't': 'tan',
            'l': 'log', 'n': 'ln', 'r': '√', '^': 'xʸ', '²': 'x²'
        };

        if (key in keyMap) {
            event.preventDefault();
            const button = Array.from(buttons).find(btn => btn.textContent === keyMap[key]);
            if (button) button.click();
        }
    });

    // Add event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    // Initialize display
    updateDisplay();
});
