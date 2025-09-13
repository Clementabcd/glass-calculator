        class GlassCalculator {
            constructor() {
                this.display = document.getElementById('display');
                this.memoryIndicator = document.getElementById('memory-indicator');
                this.historyPanel = document.getElementById('history-panel');
                this.historyContent = document.getElementById('history-content');
                this.advancedButtons = document.getElementById('advanced-buttons');
                this.simpleMemory = document.getElementById('simple-memory');
                this.advancedModeBtn = document.getElementById('advanced-mode-btn');
                this.historyBtn = document.getElementById('history-btn');

                this.currentValue = '0';
                this.previousValue = null;
                this.operation = null;
                this.waitingForOperand = false;
                this.memory = 0;
                this.history = [];
                this.isAdvancedMode = false;
                this.showHistory = false;

                this.init();
            }

            init() {
                // Event listeners pour les boutons
                document.querySelectorAll('.calc-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.handleButtonClick(e));
                });

                this.advancedModeBtn.addEventListener('click', () => this.toggleAdvancedMode());
                this.historyBtn.addEventListener('click', () => this.toggleHistory());

                // Event listener pour le clavier
                document.addEventListener('keydown', (e) => this.handleKeyPress(e));

                this.updateDisplay();
                this.updateMemoryIndicator();
            }

            handleButtonClick(e) {
                const action = e.target.dataset.action;
                const value = e.target.dataset.value;

                switch (action) {
                    case 'number':
                        this.inputNumber(value);
                        break;
                    case 'decimal':
                        this.inputDecimal();
                        break;
                    case 'operation':
                        this.performOperation(value);
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'clear-entry':
                        this.clearEntry();
                        break;
                    case 'percentage':
                        this.percentage();
                        break;
                    case 'toggle-sign':
                        this.toggleSign();
                        break;
                    case 'memory':
                        this.handleMemory(value);
                        break;
                    case 'advanced':
                        this.performAdvancedOperation(value);
                        break;
                }
            }

            inputNumber(num) {
                if (this.waitingForOperand) {
                    this.currentValue = num;
                    this.waitingForOperand = false;
                } else {
                    this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
                }
                this.updateDisplay();
            }

            inputDecimal() {
                if (this.waitingForOperand) {
                    this.currentValue = '0.';
                    this.waitingForOperand = false;
                } else if (this.currentValue.indexOf('.') === -1) {
                    this.currentValue += '.';
                }
                this.updateDisplay();
            }

            clear() {
                this.currentValue = '0';
                this.previousValue = null;
                this.operation = null;
                this.waitingForOperand = false;
                this.updateDisplay();
            }

            clearEntry() {
                this.currentValue = '0';
                this.updateDisplay();
            }

            performOperation(nextOperation) {
                const inputValue = parseFloat(this.currentValue);

                if (this.previousValue === null) {
                    this.previousValue = inputValue;
                } else if (this.operation) {
                    const currentValue = this.previousValue || 0;
                    const newValue = this.calculate(currentValue, inputValue, this.operation);

                    const historyEntry = `${currentValue} ${this.operation} ${inputValue} = ${newValue}`;
                    this.addToHistory(historyEntry);

                    this.currentValue = String(newValue);
                    this.previousValue = newValue;
                }

                this.waitingForOperand = true;
                this.operation = nextOperation;
                this.updateDisplay();
            }

            calculate(firstValue, secondValue, operation) {
                switch (operation) {
                    case '+': return firstValue + secondValue;
                    case '-': return firstValue - secondValue;
                    case '×': return firstValue * secondValue;
                    case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
                    case '=': return secondValue;
                    default: return secondValue;
                }
            }

            performAdvancedOperation(op) {
                const value = parseFloat(this.currentValue);
                let result;

                switch (op) {
                    case 'sin': result = Math.sin(value * Math.PI / 180); break;
                    case 'cos': result = Math.cos(value * Math.PI / 180); break;
                    case 'tan': result = Math.tan(value * Math.PI / 180); break;
                    case 'log': result = Math.log10(value); break;
                    case 'ln': result = Math.log(value); break;
                    case 'sqrt': result = Math.sqrt(value); break;
                    case 'x²': result = Math.pow(value, 2); break;
                    case 'x³': result = Math.pow(value, 3); break;
                    case '1/x': result = 1 / value; break;
                    case '!': result = this.factorial(value); break;
                    case 'π': result = Math.PI; break;
                    case 'e': result = Math.E; break;
                    default: return;
                }

                const historyEntry = `${op}(${value}) = ${result}`;
                this.addToHistory(historyEntry);

                this.currentValue = String(result);
                this.waitingForOperand = true;
                this.updateDisplay();
            }

            factorial(n) {
                if (n < 0 || n !== Math.floor(n)) return NaN;
                if (n === 0 || n === 1) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }

            percentage() {
                const value = parseFloat(this.currentValue);
                this.currentValue = String(value / 100);
                this.updateDisplay();
            }

            toggleSign() {
                if (this.currentValue !== '0') {
                    this.currentValue = this.currentValue.startsWith('-') 
                        ? this.currentValue.slice(1) 
                        : '-' + this.currentValue;
                    this.updateDisplay();
                }
            }

            handleMemory(action) {
                const value = parseFloat(this.currentValue);
                
                switch (action) {
                    case 'M+':
                        this.memory += value;
                        break;
                    case 'M-':
                        this.memory -= value;
                        break;
                    case 'MR':
                        this.currentValue = String(this.memory);
                        this.waitingForOperand = true;
                        this.updateDisplay();
                        break;
                    case 'MC':
                        this.memory = 0;
                        break;
                }
                this.updateMemoryIndicator();
            }

            handleKeyPress(e) {
                const { key } = e;

                if (key >= '0' && key <= '9') {
                    this.inputNumber(key);
                } else if (key === '.') {
                    this.inputDecimal();
                } else if (key === '+') {
                    this.performOperation('+');
                } else if (key === '-') {
                    this.performOperation('-');
                } else if (key === '*') {
                    this.performOperation('×');
                } else if (key === '/') {
                    e.preventDefault();
                    this.performOperation('÷');
                } else if (key === 'Enter' || key === '=') {
                    this.performOperation('=');
                } else if (key === 'Escape') {
                    this.clear();
                } else if (key === 'Backspace') {
                    if (this.currentValue.length > 1) {
                        this.currentValue = this.currentValue.slice(0, -1);
                    } else {
                        this.currentValue = '0';
                    }
                    this.updateDisplay();
                } else if (key === '%') {
                    this.percentage();
                }
            }

            updateDisplay() {
                this.display.textContent = this.currentValue;
            }

            updateMemoryIndicator() {
                if (this.memory !== 0) {
                    this.memoryIndicator.textContent = `M: ${this.memory}`;
                    this.memoryIndicator.classList.remove('hidden');
                    if (!this.isAdvancedMode) {
                        this.simpleMemory.classList.remove('hidden');
                    }
                } else {
                    this.memoryIndicator.classList.add('hidden');
                    if (!this.isAdvancedMode) {
                        this.simpleMemory.classList.add('hidden');
                    }
                }
            }

            addToHistory(entry) {
                this.history.unshift(entry);
                if (this.history.length > 20) {
                    this.history.pop();
                }
                this.updateHistoryDisplay();
            }

            updateHistoryDisplay() {
                if (this.history.length === 0) {
                    this.historyContent.innerHTML = '<div class="text-white/50">Aucun historique</div>';
                } else {
                    this.historyContent.innerHTML = this.history
                        .map(entry => `<div class="text-white/70">${entry}</div>`)
                        .join('');
                }
            }

            toggleAdvancedMode() {
                this.isAdvancedMode = !this.isAdvancedMode;
                this.advancedModeBtn.textContent = this.isAdvancedMode ? 'Simple' : 'Avancé';
                
                if (this.isAdvancedMode) {
                    this.advancedButtons.classList.remove('hidden');
                    this.simpleMemory.classList.add('hidden');
                } else {
                    this.advancedButtons.classList.add('hidden');
                    if (this.memory !== 0) {
                        this.simpleMemory.classList.remove('hidden');
                    }
                }
            }

            toggleHistory() {
                this.showHistory = !this.showHistory;
                if (this.showHistory) {
                    this.historyPanel.classList.remove('hidden');
                } else {
                    this.historyPanel.classList.add('hidden');
                }
            }
        }

        // Initialiser la calculatrice quand la page est chargée
        document.addEventListener('DOMContentLoaded', () => {
            new GlassCalculator();
        });

        // --- Gestion des arrière-plans dynamiques ---
        document.addEventListener("DOMContentLoaded", () => {
            const bgContainer = document.getElementById("background-image");

            const backgrounds = [
                "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80"
            ];

            let currentIndex = 0;

            // Création de 2 calques pour le fondu enchaîné
            const img1 = document.createElement("div");
            const img2 = document.createElement("div");
            [img1, img2].forEach(img => {
                img.className = "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 bg-zoom";
                bgContainer.appendChild(img);
            });

            let active = img1;
            let next = img2;

            function changeBackground() {
                // Choisir une image aléatoire différente de la précédente
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * backgrounds.length);
                } while (nextIndex === currentIndex);
                currentIndex = nextIndex;

                next.style.backgroundImage = `url(${backgrounds[currentIndex]})`;

                // Animation
                active.classList.remove("active");
                active.classList.add("inactive");

                next.classList.remove("inactive");
                next.classList.add("active");

                // Swap des calques
                [active, next] = [next, active];
            }

            // Initialisation
            img1.style.backgroundImage = `url(${backgrounds[0]})`;
            img1.classList.add("active");

            // Changement toutes les 12 secondes
            setInterval(changeBackground, 12000);
        });
