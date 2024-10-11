let tape = ['●', 'a', 'a', 'b', 'b', 'c', 'c', 'β', 'β'];
let head = 0;
let state = 'q0'; // Estado inicial
let acceptingState = 'q6'; // Estado de aceitação

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

function step() {
    let symbol = tape[head];
    let [nextState, writeSymbol, direction] = transitions[state][symbol] || [null, null, null];
    
    if (!nextState) {
        document.getElementById('result').textContent = 'Erro: Transição inválida!';
        return;
    }

    tape[head] = writeSymbol;
    state = nextState;
    head += direction === 'D' ? 1 : -1;

    renderTape();

    if (state === acceptingState) {
        document.getElementById('result').textContent = 'Aceito!';
    }
}

function startTuringMachine() {
    document.getElementById('result').textContent = '';
    let interval = setInterval(() => {
        if (state === acceptingState) {
            clearInterval(interval);
        } else {
            step();
        }
    }, 1000);
}

renderTape();
