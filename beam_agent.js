// BEAM SEARCH AGENT 
const BEAM_WIDTH = 5;

/**
 * Selecting the best move using Beam Search.
 * It checks the current piece, finds the best N moves,
 * then checks the *next* piece for each of those N moves.
 */
function selectBestMove_BEAM(currentPiece, nextPiece, board) {
    
    // --- Step 1: Get all moves for the CURRENT piece ---
    let firstMoves = getMoves(currentPiece, board);

    if (firstMoves.length === 0) {
        return null; // No moves possible
    }

    // Sort by score and keep the top N (the "beam")
    firstMoves.sort((a, b) => b.score - a.score);
    let candidates = firstMoves.slice(0, BEAM_WIDTH);

    let bestMove = null;
    let bestTotalScore = -Infinity;

    // --- Step 2: Look ahead at the NEXT piece ---
    for (let i = 0; i < candidates.length; i++) {
        let firstMove = candidates[i];

        // If there is no next piece, just use the first move's score
        if (!nextPiece) {
            if (firstMove.score > bestTotalScore) {
                bestTotalScore = firstMove.score;
                bestMove = firstMove;
            }
            continue;
        }

        // --- Step 3: Find the best outcome for the NEXT piece ---
        // Get all possible moves for the next piece,
        // using the board state *after* our first move.
        let nextMoves = getMoves(nextPiece, firstMove.board);
        
        let bestNextScore = -Infinity;
        if (nextMoves.length > 0) {
            // Find the best score from this second set of moves
            for (let j = 0; j < nextMoves.length; j++) {
                if (nextMoves[j].score > bestNextScore) {
                    bestNextScore = nextMoves[j].score;
                }
            }
        } else {
            bestNextScore = -999999;
        }

        // The total score for this path is the sum of both moves.
        // We use the first move's score *plus* the best possible second move's score.
        let totalScore = firstMove.score + bestNextScore;

        if (totalScore > bestTotalScore) {
            bestTotalScore = totalScore;
            bestMove = firstMove;
        }
    }

    // Fallback just in case 
    if (!bestMove) {
        return firstMoves[0];
    }

    return bestMove;
}