let tape = ['●', 'a', 'a', 'b', 'b', 'c', 'c', 'β'];
let head = 0;
let state = 'q0';
let acceptingState = 'q6';
let countIteractions = 0;

function setInputTape() {
    const input = document.getElementById('input-sequence').value;
    countIteractions = 0;
    if (input) {
        tape = ['●', ...input.split(''), 'β'];  
        head = 0; 
        state = 'q0'; 
        renderTape(); 
        document.getElementById('result').textContent = '';
    } else {
        alert('Por favor, insira uma sequência de entrada.');
    }
}
const transitions = {
    'q0': {
        '●': ['q1', '●', 'D'],
    },
    'q1': {
        'a': ['q2', 'A', 'D'], 
        'B': ['q5', 'B', 'D'],
        'β': ['q6', 'β', 'D'],
    },
    'q2': {
        'a': ['q2', 'a', 'D'],
        'b': ['q3', 'B', 'D'],
        'B': ['q2', 'B', 'D'],
    },
    'q3': {
        'b': ['q3', 'b', 'D'],
        'c': ['q4', 'C', 'E'],
        'C': ['q3', 'C', 'D'],
    },
    'q4': {
        'a': ['q4', 'a', 'E'],
        'b': ['q4', 'b', 'E'],
        'A': ['q1', 'A', 'D'],
        'B': ['q4', 'B', 'E'],
        'C': ['q4', 'C', 'E'],
    },
    'q5': {
        'B': ['q5', 'B', 'D'],
        'C': ['q5', 'C', 'D'],
        'β': ['q6', 'β', 'D'],
    },
};

function clearTableHighlight() {
    const tableCells = document.querySelectorAll('#transition-table td');
    tableCells.forEach(cell => {
        cell.classList.remove('highlight');
    });
}

function highlightTransition(state, symbol) {
    const rows = document.querySelectorAll('#transition-table tbody tr');
    
    rows.forEach(row => {
        const stateCell = row.querySelector('td:first-child');
        if (stateCell && stateCell.textContent.includes(state)) {
            const columns = row.querySelectorAll('td');
            const symbolIndex = { '●': 1, 'a': 2, 'b': 3, 'c': 4, 'A': 5, 'B': 6, 'C': 7, 'β': 8 };
            
            if (symbolIndex[symbol] != null) {
                const cellToHighlight = columns[symbolIndex[symbol]];
                if (cellToHighlight) {
                    cellToHighlight.classList.add('highlight');
                }
            }
        }
    });
}

function step() {
    clearTableHighlight(); 
    
    let symbol = tape[head];
    let [nextState, writeSymbol, direction] = transitions[state][symbol] || [null, null, null];
    
    if (!nextState) {
        let errorIn = countIteractions + 1;
        document.getElementById('result').textContent = 'Erro em '+ errorIn +' iterações!';
        return false;
    }
    countIteractions++;

    highlightTransition(state, symbol);

    tape[head] = writeSymbol;
    state = nextState;
    head += direction === 'D' ? 1 : -1;

    renderTape();

    if (state === acceptingState) {
        document.getElementById('result').textContent = 'Aceito em ' + countIteractions + ' iterações!';
    }
}

function startTuringMachine() {
    document.getElementById('result').textContent = '';
    let interval = setInterval(() => {
        if (state === acceptingState) {
            clearInterval(interval);
        } else {
            if (!step()){
                return;
            }
        }
    }, 1000);
}

function renderTape() {
    const tapeContainer = document.getElementById('tape');
    tapeContainer.innerHTML = '';
    tape.forEach((symbol, index) => {
        const cell = document.createElement('div');
        cell.textContent = symbol;
        if (index === head) {
            cell.style.backgroundColor = 'yellow';
        }
        tapeContainer.appendChild(cell);
    });
}

renderTape();