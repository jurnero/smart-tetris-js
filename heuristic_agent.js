// Heuristic evaluation function
function evaluateBoard(board) {
    let aggregateHeight = 0;
    let maxHeight = 0;
    let completeLines = 0;
    let holes = 0;
    let bumpiness = 0;
    let rowTransitions = 0;
    let columnTransitions = 0;
    let wellDepth = 0;
    let columnHeights = new Array(nx).fill(0);

    // Calculate aggregate height, max height, and column heights
    for (let x = 0; x < nx; x++) {
        for (let y = 0; y < ny; y++) {
            if (board[x][y] !== 0) {
                columnHeights[x] = ny - y;
                break;
            }
        }
        aggregateHeight += columnHeights[x];
        if (columnHeights[x] > maxHeight) {
            maxHeight = columnHeights[x];
        }
    }

    // Calculate complete lines
    for (let y = 0; y < ny; y++) {
        var complete = true;
        for (let x = 0; x < nx; x++) {
            if (board[x][y] === 0) {
                complete = false;
                break;
            }
        }
        if (complete)
            completeLines++;
    }

    // Calculate holes
    for (let x = 0; x < nx; x++) {
        let blockFound = false;
        for (let y = 0; y < ny; y++) {
            if (board[x][y] !== 0) {
                blockFound = true;
            } else if (blockFound && board[x][y] === 0) {
                holes++;
            }
        }
    }

    // Calculate bumpiness
    for (let x = 0; x < nx - 1; x++) {
        bumpiness += Math.abs(columnHeights[x] - columnHeights[x + 1]);
    }

    // Calculate row transitions
    for (let y = 0; y < ny; y++) {
        if (board[0][y] === 0) {
            rowTransitions++;
        }
        for (let x = 0; x < nx - 1; x++) {
            if ((board[x][y] === 0) !== (board[x + 1][y] === 0)) {
                rowTransitions++;
            }
        }
        if (board[nx - 1][y] === 0) {
            rowTransitions++;
        }
    }

    // Calculate column transitions
    for (let x = 0; x < nx; x++) {
        if (board[x][0] === 0) {
            columnTransitions++;
        }
        for (let y = 0; y < ny - 1; y++) {
            if ((board[x][y] === 0) !== (board[x][y + 1] === 0)) {
                columnTransitions++;
            }
        }
        if (board[x][ny - 1] === 0) {
            columnTransitions++;
        }
    }

    // Calculate well depth
    for (let x = 0; x < nx; x++) {
        let leftHeight = (x > 0) ? columnHeights[x - 1] : ny;
        let rightHeight = (x < nx - 1) ? columnHeights[x + 1] : ny;
        let currentHeight = columnHeights[x];
        
        if (currentHeight < leftHeight && currentHeight < rightHeight) {
            let wellDepthValue = Math.min(leftHeight, rightHeight) - currentHeight;
            if (wellDepthValue <= 4) {
                wellDepth += wellDepthValue * 0.5;
            } else {
                wellDepth -= (wellDepthValue - 4) * 0.3;
            }
        }
    }

    // Tuned weights
    let score = 
        -0.5 * aggregateHeight +   // total height
        -0.75 * maxHeight +        // max height
         0.35 * completeLines +    // complete lines
        -0.18 * holes +            // holes
        -0.18 * bumpiness +        // bumpiness
        -0.025 * rowTransitions +  // row transitions
        -0.025 * columnTransitions + // column transitions
         0.03 * wellDepth;         // well depth

    return score;
}

// Copy the board
function copyBlocks(blocks) {
    let new_blocks = [];
    for (let x = 0; x < nx; x++) {
        new_blocks[x] = [];
        for (let y = 0; y < ny; y++) {
            new_blocks[x][y] = blocks[x][y];
        }
    }
    return new_blocks;
}

// Get all possible moves
function getPossibleMoves(piece) {
    let moves = [];
    // For each rotation of the piece
    for (let dir = 0; dir < 4; dir++) {
        // Create a copy for this rotation
        let testPiece = { type: piece.type, dir: dir, x: piece.x, y: piece.y };
        // For each horizontal position
        for (let x = 0; x <= nx - piece.type.size; x++) {
            // Check if piece can fit at this position
            if (!occupied(testPiece.type, x, 0, dir)) {
                let y = getDropPosition(testPiece, x);
                let new_blocks = copyBlocks(blocks);
                eachblock(testPiece.type, x, y, dir, function(x, y) {
                    new_blocks[x][y] = testPiece.type;
                });
                moves.push({piece: testPiece, x: x, y: y, board: new_blocks});
            }
        }
    }
    return moves;
}

// Find the best move
function selectBestMove(piece, board) {
    let moves = getPossibleMoves(piece);
    let bestMove = null;
    let bestScore = -Infinity;
    moves.forEach(move => {
        let score = evaluateBoard(move.board);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    });
    return bestMove;
}

// Get drop position
function getDropPosition(piece, x) {
    let y = 0;
    while (!occupied(piece.type, x, y + 1, piece.dir)) {
        y++;
    }
    return y;
}