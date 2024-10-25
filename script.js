let tape = ['●', 'a', 'a', 'b', 'b', 'c', 'c', 'β'];
let head = 0;
let state = 'q0';
let acceptingState = 'q6';
let countIteractions = 0;
let history = [];

function setInputTape() {
    const input = document.getElementById('input-sequence').value;
    countIteractions = 0;
    history = [];
    if (input) {
        tape = ['●', ...input.split(''), 'β'];
        head = 0;
        state = 'q0';
        renderTape();
        document.getElementById('result').textContent = '';
        clearStepsTable();
    } else {
        alert('Por favor, insira uma sequência de entrada.');
    }
}

const transitions = {
    'q0': { '●': ['q1', '●', 'D'] },
    'q1': { 'a': ['q2', 'A', 'D'], 'B': ['q5', 'B', 'D'], 'β': ['q6', 'β', 'D'] },
    'q2': { 'a': ['q2', 'a', 'D'], 'b': ['q3', 'B', 'D'], 'B': ['q2', 'B', 'D'] },
    'q3': { 'b': ['q3', 'b', 'D'], 'c': ['q4', 'C', 'E'], 'C': ['q3', 'C', 'D'] },
    'q4': { 'a': ['q4', 'a', 'E'], 'b': ['q4', 'b', 'E'], 'A': ['q1', 'A', 'D'], 'B': ['q4', 'B', 'E'], 'C': ['q4', 'C', 'E'] },
    'q5': { 'B': ['q5', 'B', 'D'], 'C': ['q5', 'C', 'D'], 'β': ['q6', 'β', 'D'] },
};

function clearTableHighlight() {
    const tableCells = document.querySelectorAll('#transition-table td');
    tableCells.forEach(cell => cell.classList.remove('highlight'));
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
                if (cellToHighlight) cellToHighlight.classList.add('highlight');
            }
        }
    });
}

function logStep(iteration, currentState, readSymbol, nextState, writeSymbol, direction, headPosition) {
    const tableBody = document.querySelector('#steps-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${iteration}</td>
        <td>${currentState}</td>
        <td>${readSymbol}</td>
        <td>${nextState}</td>
        <td>${writeSymbol}</td>
        <td>${direction}</td>
        <td>${headPosition}</td>
    `;
    tableBody.appendChild(row);
}

function clearStepsTable() {
    const tableBody = document.querySelector('#steps-table tbody');
    tableBody.innerHTML = '';
}

function step() {
    clearTableHighlight();

    let symbol = tape[head];
    let [nextState, writeSymbol, direction] = transitions[state][symbol] || [null, null, null];
    
    if (!nextState) {
        let errorIn = countIteractions + 1;
        document.getElementById('result').textContent = 'Erro em ' + errorIn + ' iterações!';
        return false;
    }

    history.push({
        tape: [...tape],
        state,
        head,
        countIteractions,
        symbol
    });
    
    countIteractions++;
    logStep(countIteractions, state, symbol, nextState, writeSymbol, direction, head);
    
    highlightTransition(state, symbol);

    tape[head] = writeSymbol;
    state = nextState;
    head += direction === 'D' ? 1 : -1;

    renderTape();

    if (state === acceptingState) {
        document.getElementById('result').textContent = 'Aceito em ' + countIteractions + ' iterações!';
    }
    return true;
}

function prevStep() {
    if (history.length === 0) {
        alert("Não há passos anteriores.");
        return;
    }
    clearTableHighlight();

    const lastStep = history.pop();
    tape = lastStep.tape;
    state = lastStep.state;
    head = lastStep.head;
    countIteractions = lastStep.countIteractions;
    console.log(history)
    if (history.length > 0) {
        backStep = history[history.length - 1];
        highlightTransition(backStep.state, backStep.symbol);
    }

    
    const tableBody = document.querySelector('#steps-table tbody');
    tableBody.removeChild(tableBody.lastChild);
    
    renderTape();
    document.getElementById('result').textContent = '';
}


function startTuringMachine() {
    document.getElementById('result').textContent = '';
    let interval = setInterval(() => {
        if (state === acceptingState) {
            clearInterval(interval);
        } else {
            if (!step()){
                console.log('parou')
                clearInterval(interval);
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
        if (index === head) cell.style.backgroundColor = 'green';
        tapeContainer.appendChild(cell);
    });
}

renderTape();
