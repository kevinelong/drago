class GoGame {
    constructor() {
        this.boardSize = 9;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.capturedStones = { black: 0, white: 0 };
        this.lastMove = null;
        this.koPoint = null;
        this.stonesInBowl = { black: 81, white: 81 }; // 9x9 board needs fewer stones
        
        this.initializeGame();
        this.setupEventListeners();
        this.setupMenuEventListeners();
    }

    initializeGame() {
        this.createBoard();
        this.createStoneBowls();
        this.createCapturedBowls();
        this.updateDisplay();
    }

    createBoard() {
        const svg = document.querySelector('.board-svg');
        const intersectionPoints = document.getElementById('intersection-points');
        
        // Clear existing content
        svg.innerHTML = '';
        intersectionPoints.innerHTML = '';
        
        // Define star points based on board size
        const starPoints = this.getStarPoints();

        // Board dimensions
        const boardWidth = 560;
        const boardHeight = 560;
        const margin = 20;
        const cellSize = (boardWidth - 2 * margin) / (this.boardSize - 1);
        
        // Calculate scale factor for intersection points container
        // Base size is for 19x19 board (18 cells), so scale based on current board size
        const baseBoardSize = 19;
        const scaleFactor = (this.boardSize - 1) / (baseBoardSize - 1);
        
        // Apply scaling to intersection points container using CSS custom properties
        intersectionPoints.style.setProperty('--scale-factor', scaleFactor);
        intersectionPoints.style.width = (boardWidth * scaleFactor) + 'px';
        intersectionPoints.style.height = (boardHeight * scaleFactor) + 'px';

        // Create grid lines
        for (let i = 0; i < this.boardSize; i++) {
            // Vertical lines
            const x = margin + i * cellSize;
            const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            verticalLine.setAttribute('x1', x);
            verticalLine.setAttribute('y1', margin);
            verticalLine.setAttribute('x2', x);
            verticalLine.setAttribute('y2', boardHeight - margin);
            svg.appendChild(verticalLine);

            // Horizontal lines
            const y = margin + i * cellSize;
            const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            horizontalLine.setAttribute('x1', margin);
            horizontalLine.setAttribute('y1', y);
            horizontalLine.setAttribute('x2', boardWidth - margin);
            horizontalLine.setAttribute('y2', y);
            svg.appendChild(horizontalLine);
        }

        // Create intersection points
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const intersectionPoint = document.createElement('div');
                intersectionPoint.className = 'intersection-point';
                
                // Calculate position
                const x = margin + col * cellSize;
                const y = margin + row * cellSize;
                
                intersectionPoint.style.left = x + 'px';
                intersectionPoint.style.top = y + 'px';
                
                intersectionPoint.dataset.row = row;
                intersectionPoint.dataset.col = col;
                
                // Add star point class if applicable
                if (starPoints.some(([r, c]) => r === row && c === col)) {
                    intersectionPoint.classList.add('star-point');
                }
                
                intersectionPoints.appendChild(intersectionPoint);
            }
        }
    }

    getStarPoints() {
        // Define star points based on board size
        if (this.boardSize === 9) {
            return [
                [2, 2], [2, 6],
                [4, 4],
                [6, 2], [6, 6]
            ];
        } else if (this.boardSize === 13) {
            return [
                [3, 3], [3, 9],
                [6, 6],
                [9, 3], [9, 9]
            ];
        } else if (this.boardSize === 19) {
            return [
                [3, 3], [3, 9], [3, 15],
                [9, 3], [9, 9], [9, 15],
                [15, 3], [15, 9], [15, 15]
            ];
        } else {
            // For custom sizes, calculate star points
            const third = Math.floor(this.boardSize / 3);
            const twoThirds = Math.floor(2 * this.boardSize / 3);
            const center = Math.floor(this.boardSize / 2);
            
            return [
                [third, third], [third, twoThirds],
                [center, center],
                [twoThirds, third], [twoThirds, twoThirds]
            ];
        }
    }

    updateBoardScaling() {
        const intersectionPoints = document.getElementById('intersection-points');
        
        // Calculate scale factor for intersection points container
        // Base size is for 19x19 board (18 cells), so scale based on current board size
        const baseBoardSize = 19;
        const scaleFactor = (this.boardSize - 1) / (baseBoardSize - 1);
        
        // Apply scaling to intersection points container using CSS custom properties
        intersectionPoints.style.setProperty('--scale-factor', scaleFactor);
        intersectionPoints.style.width = (560 * scaleFactor) + 'px';
        intersectionPoints.style.height = (560 * scaleFactor) + 'px';
    }

    createStoneBowls() {
        const blackContainer = document.getElementById('black-stones-container');
        const whiteContainer = document.getElementById('white-stones-container');
        
        // Clear existing stones
        blackContainer.innerHTML = '';
        whiteContainer.innerHTML = '';
        
        // Calculate stone count based on board size
        const stoneCount = this.boardSize * this.boardSize;
        this.stonesInBowl = { black: stoneCount, white: stoneCount };
        
        // Create stones for black bowl
        for (let i = 0; i < this.stonesInBowl.black; i++) {
            const stone = this.createStone('black');
            blackContainer.appendChild(stone);
        }
        
        // Create stones for white bowl
        for (let i = 0; i < this.stonesInBowl.white; i++) {
            const stone = this.createStone('white');
            whiteContainer.appendChild(stone);
        }
    }

    createCapturedBowls() {
        const blackCapturedContainer = document.getElementById('black-captured-container');
        const whiteCapturedContainer = document.getElementById('white-captured-container');
        
        // These will be populated as stones are captured
        blackCapturedContainer.innerHTML = '<p>No stones captured</p>';
        whiteCapturedContainer.innerHTML = '<p>No stones captured</p>';
    }

    createStone(color) {
        const stone = document.createElement('div');
        stone.className = `stone ${color}`;
        stone.draggable = true;
        stone.dataset.color = color;
        stone.dataset.type = 'bowl-stone';
        
        return stone;
    }

    setupEventListeners() {
        // Stone drag events
        document.addEventListener('dragstart', this.handleDragStart.bind(this));
        document.addEventListener('dragend', this.handleDragEnd.bind(this));
        document.addEventListener('dragover', this.handleDragOver.bind(this));
        document.addEventListener('drop', this.handleDrop.bind(this));
        
        // Board intersection point events
        document.addEventListener('click', this.handleBoardClick.bind(this));
        
        // Control button events
        document.getElementById('pass-button').addEventListener('click', () => this.pass());
        document.getElementById('resign-button').addEventListener('click', () => this.resign());
        document.getElementById('new-game-button').addEventListener('click', () => this.newGame());
        
        // Window resize event to recalculate scaling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateBoardScaling();
            }, 100);
        });
    }

    setupMenuEventListeners() {
        // Menu button
        const menuButton = document.getElementById('menu-button');
        const menuDropdown = document.getElementById('menu-dropdown');
        
        menuButton.addEventListener('click', () => {
            menuDropdown.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('show');
            }
        });
        
        // Preferences button
        document.getElementById('preferences-button').addEventListener('click', () => {
            this.showPreferences();
        });
        
        // Board size select
        const boardSizeSelect = document.getElementById('board-size');
        const customSizeGroup = document.getElementById('custom-size-group');
        
        boardSizeSelect.addEventListener('change', () => {
            if (boardSizeSelect.value === 'custom') {
                customSizeGroup.style.display = 'block';
            } else {
                customSizeGroup.style.display = 'none';
            }
        });
        
        // Apply preferences
        document.getElementById('apply-preferences').addEventListener('click', () => {
            this.applyPreferences();
        });
        
        // Close preferences
        document.getElementById('close-preferences').addEventListener('click', () => {
            this.hidePreferences();
        });
        
        document.getElementById('cancel-preferences').addEventListener('click', () => {
            this.hidePreferences();
        });
        
        // Close dialog when clicking overlay
        document.getElementById('preferences-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'preferences-dialog') {
                this.hidePreferences();
            }
        });
    }

    showPreferences() {
        const dialog = document.getElementById('preferences-dialog');
        const boardSizeSelect = document.getElementById('board-size');
        const customSizeInput = document.getElementById('custom-size-input');
        
        // Set current values
        if (this.boardSize === 9) {
            boardSizeSelect.value = '9';
        } else if (this.boardSize === 13) {
            boardSizeSelect.value = '13';
        } else if (this.boardSize === 19) {
            boardSizeSelect.value = '19';
        } else {
            boardSizeSelect.value = 'custom';
            customSizeInput.value = this.boardSize;
            document.getElementById('custom-size-group').style.display = 'block';
        }
        
        dialog.classList.add('show');
        document.getElementById('menu-dropdown').classList.remove('show');
    }

    hidePreferences() {
        document.getElementById('preferences-dialog').classList.remove('show');
    }

    applyPreferences() {
        const boardSizeSelect = document.getElementById('board-size');
        const customSizeInput = document.getElementById('custom-size-input');
        
        let newBoardSize;
        if (boardSizeSelect.value === 'custom') {
            newBoardSize = parseInt(customSizeInput.value);
            if (newBoardSize < 5 || newBoardSize > 50) {
                alert('Custom board size must be between 5 and 50');
                return;
            }
        } else {
            newBoardSize = parseInt(boardSizeSelect.value);
        }
        
        if (newBoardSize !== this.boardSize) {
            this.boardSize = newBoardSize;
            this.resetGame();
        }
        
        this.hidePreferences();
    }

    resetGame() {
        // Reset game state
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.capturedStones = { black: 0, white: 0 };
        this.lastMove = null;
        this.koPoint = null;
        
        // Update board class for stone sizing
        const goBoard = document.getElementById('go-board');
        goBoard.className = 'go-board';
        if (this.boardSize === 9) {
            goBoard.classList.add('board-size-9');
        } else if (this.boardSize === 13) {
            goBoard.classList.add('board-size-13');
        } else if (this.boardSize === 19) {
            goBoard.classList.add('board-size-19');
        } else {
            goBoard.classList.add('board-size-custom');
        }
        
        // Reinitialize game
        this.initializeGame();
    }

    handleDragStart(e) {
        if (e.target.classList.contains('stone')) {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', JSON.stringify({
                color: e.target.dataset.color,
                type: e.target.dataset.type,
                source: e.target.closest('.bowl')?.id || 'board'
            }));
        }
    }

    handleDragEnd(e) {
        if (e.target.classList.contains('stone')) {
            e.target.classList.remove('dragging');
        }
        // Remove drag-over styling
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains('intersection-point') || 
            e.target.classList.contains('captured-bowl')) {
            e.target.classList.add('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const draggedElement = document.querySelector('.stone.dragging');
        
        if (!draggedElement) return;
        
        if (e.target.classList.contains('intersection-point')) {
            this.handleBoardDrop(e.target, data, draggedElement);
        } else if (e.target.classList.contains('captured-bowl')) {
            this.handleCaptureDrop(e.target, data, draggedElement);
        }
    }

    handleBoardDrop(intersectionPoint, data, draggedElement) {
        const row = parseInt(intersectionPoint.dataset.row);
        const col = parseInt(intersectionPoint.dataset.col);
        
        // Check if it's a valid move
        if (this.isValidMove(row, col, data.color)) {
            this.placeStone(row, col, data.color, draggedElement);
        } else {
            // Return stone to original position
            this.returnStoneToBowl(draggedElement, data.color);
        }
    }

    handleCaptureDrop(capturedBowl, data, draggedElement) {
        // Only allow capturing opponent's stones from the board
        if (data.type === 'board-stone' && 
            data.color !== this.currentPlayer) {
            this.captureStone(draggedElement, data.color);
        } else {
            // Return stone to original position
            this.returnStoneToBowl(draggedElement, data.color);
        }
    }

    handleBoardClick(e) {
        if (e.target.classList.contains('intersection-point')) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            
            // If intersection is empty, try to place a stone
            if (!this.board[row][col]) {
                this.placeStoneFromBowl(row, col);
            }
        }
    }

    placeStoneFromBowl(row, col) {
        if (this.isValidMove(row, col, this.currentPlayer)) {
            // Find a stone in the current player's bowl
            const bowlId = `${this.currentPlayer}-stones-container`;
            const bowl = document.getElementById(bowlId);
            const stone = bowl.querySelector('.stone');
            
            if (stone) {
                this.placeStone(row, col, this.currentPlayer, stone);
            }
        }
    }

    placeStone(row, col, color, stoneElement) {
        // Remove stone from bowl
        stoneElement.remove();
        this.stonesInBowl[color]--;
        
        // Place stone on board
        this.board[row][col] = color;
        
        // Create new stone element for board
        const boardStone = this.createStone(color);
        boardStone.dataset.type = 'board-stone';
        boardStone.dataset.row = row;
        boardStone.dataset.col = col;
        boardStone.classList.add('on-board', 'place-animation');
        
        // Position stone on board
        const intersectionPoint = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        intersectionPoint.appendChild(boardStone);
        
        // Check for captures
        const captured = this.checkCaptures(row, col, color);
        this.capturedStones[color === 'black' ? 'white' : 'black'] += captured;
        
        // Update ko point
        this.updateKoPoint(row, col, captured);
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.lastMove = { row, col, color };
        
        this.updateDisplay();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            boardStone.classList.remove('place-animation');
        }, 300);
    }

    captureStone(stoneElement, color) {
        // Remove from board
        const row = parseInt(stoneElement.dataset.row);
        const col = parseInt(stoneElement.dataset.col);
        this.board[row][col] = null;
        
        // Add capture animation
        stoneElement.classList.add('capture-animation');
        
        setTimeout(() => {
            stoneElement.remove();
            
            // Add to captured bowl
            const capturedBowlId = `${color === 'black' ? 'black' : 'white'}-captured-container`;
            const capturedContainer = document.getElementById(capturedBowlId);
            
            // Remove "No stones captured" message if present
            if (capturedContainer.querySelector('p')) {
                capturedContainer.innerHTML = '';
            }
            
            const capturedStone = document.createElement('div');
            capturedStone.className = `captured-stone ${color}`;
            capturedContainer.appendChild(capturedStone);
            
            this.updateDisplay();
        }, 300);
    }

    returnStoneToBowl(stoneElement, color) {
        const bowlId = `${color}-stones-container`;
        const bowl = document.getElementById(bowlId);
        bowl.appendChild(stoneElement);
    }

    isValidMove(row, col, color) {
        // Check if position is empty
        if (this.board[row][col] !== null) {
            return false;
        }
        
        // Check ko rule
        if (this.koPoint && this.koPoint.row === row && this.koPoint.col === col) {
            return false;
        }
        
        // Check if move would be suicide (simplified - in real Go this is more complex)
        const tempBoard = this.board.map(row => [...row]);
        tempBoard[row][col] = color;
        
        // Check if the group has liberties
        if (!this.hasLiberties(row, col, tempBoard)) {
            // Check if it captures opponent stones
            const captures = this.getAdjacentOpponentStones(row, col, color, tempBoard);
            let hasCaptures = false;
            
            for (const [adjRow, adjCol] of captures) {
                if (!this.hasLiberties(adjRow, adjCol, tempBoard)) {
                    hasCaptures = true;
                    break;
                }
            }
            
            if (!hasCaptures) {
                return false;
            }
        }
        
        return true;
    }

    hasLiberties(row, col, board) {
        const color = board[row][col];
        if (!color) return true;
        
        const visited = new Set();
        const group = new Set();
        
        const dfs = (r, c) => {
            const key = `${r},${c}`;
            if (visited.has(key)) return;
            visited.add(key);
            
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) return;
            if (board[r][c] !== color) return;
            
            group.add(key);
            
            // Check adjacent positions for liberties
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                
                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (board[nr][nc] === null) {
                        return true; // Found a liberty
                    } else if (board[nr][nc] === color) {
                        dfs(nr, nc);
                    }
                }
            }
        };
        
        dfs(row, col);
        
        // Check if any position in the group has liberties
        for (const pos of group) {
            const [r, c] = pos.split(',').map(Number);
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (board[nr][nc] === null) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    getAdjacentOpponentStones(row, col, color, board) {
        const opponent = color === 'black' ? 'white' : 'black';
        const adjacent = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                if (board[nr][nc] === opponent) {
                    adjacent.push([nr, nc]);
                }
            }
        }
        
        return adjacent;
    }

    checkCaptures(row, col, color) {
        const opponent = color === 'black' ? 'white' : 'black';
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let capturedCount = 0;
        
        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            
            if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                if (this.board[nr][nc] === opponent && !this.hasLiberties(nr, nc, this.board)) {
                    capturedCount += this.removeGroup(nr, nc);
                }
            }
        }
        
        return capturedCount;
    }

    removeGroup(row, col) {
        const color = this.board[row][col];
        if (!color) return 0;
        
        const group = new Set();
        const stack = [[row, col]];
        
        while (stack.length > 0) {
            const [r, c] = stack.pop();
            const key = `${r},${c}`;
            
            if (group.has(key)) continue;
            group.add(key);
            
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) continue;
            if (this.board[r][c] !== color) continue;
            
            this.board[r][c] = null;
            
            // Remove stone element from DOM
            const stoneElement = document.querySelector(`[data-row="${r}"][data-col="${c}"] .stone`);
            if (stoneElement) {
                this.captureStone(stoneElement, color);
            }
            
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                stack.push([r + dr, c + dc]);
            }
        }
        
        return group.size;
    }

    updateKoPoint(row, col, captured) {
        // Simplified ko rule: if exactly one stone was captured, set ko point
        if (captured === 1) {
            this.koPoint = { row, col };
        } else {
            this.koPoint = null;
        }
    }

    updateDisplay() {
        // Update current player display
        document.getElementById('current-player').textContent = 
            this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        
        // Update captured stones count
        document.getElementById('black-captured').textContent = this.capturedStones.black;
        document.getElementById('white-captured').textContent = this.capturedStones.white;
        
        // Update stone counts in bowls
        const blackBowl = document.getElementById('black-stones-container');
        const whiteBowl = document.getElementById('white-stones-container');
        
        // Update bowl titles to show remaining stones
        document.querySelector('.black-bowl h3').textContent = 
            `Black Stones (${this.stonesInBowl.black})`;
        document.querySelector('.white-bowl h3').textContent = 
            `White Stones (${this.stonesInBowl.white})`;
    }

    pass() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.lastMove = null;
        this.koPoint = null;
        this.updateDisplay();
    }

    resign() {
        const winner = this.currentPlayer === 'black' ? 'White' : 'Black';
        alert(`Game Over! ${winner} wins by resignation.`);
    }

    newGame() {
        if (confirm('Start a new game?')) {
            location.reload();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GoGame();
}); 