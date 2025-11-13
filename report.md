# My Tetris AI Journey
## Introduction

In this project, I took a broken Tetris AI and gradually turned it into a functional and smarter player.
The work included fixing core logic bugs, improving the heuristic evaluation, and adding a simple lookahead algorithm Beam Search.

## Debugging the Agent

The first major issue appeared immediately: the AI behaved unpredictably.
Pieces rotated randomly, teleported, or ended up in impossible positions.

After tracing the problem, I found that the bug was caused by the function getPossibleMoves():

It used piece.dir = dir inside the simulation loop

Since JavaScript objects are passed by reference, this modified the actual game piece

The AI was literally rotating the real piece while “thinking”

## Fix

To solve this, I added a deep-copy mechanism:

Every simulated move now uses a clone of the board

The piece used for testing is also a temporary object

The real piece is no longer mutated during AI evaluation

This completely removed the “ghost rotation” and stabilized the game.

## Improving the Heuristic

The original heuristic considered only height and holes, which led to unstable structures.
To improve the evaluation, I added additional features inspired by the El-Tetris algorithm.

## Added Features

Bumpiness – measures differences between column heights

Row transitions – counts how often a row switches between filled and empty

These features help detect “Swiss cheese” boards and unstable stacking.

## Weight Adjustments

I tuned the weights to strongly penalize holes and jagged surfaces while rewarding flatter boards:

Height:       -0.51
Lines:         0.76
Holes:        -0.36
Bumpiness:    -0.18
RowTransitions: added penalty


The agent became noticeably more consistent and avoided risky placements.

## Implementing Beam Search

The heuristic agent was still greedy because it only evaluated the current piece.
To address this, I implemented a Beam Search with depth 2 (current piece + next piece).

## How It Works

Generate all valid moves for the current piece

Score the resulting boards

Keep the best 5 (beam width)

For these 5 boards, simulate placements of the next piece

Choose the move that leads to the best future outcome

This adds a simple but effective form of lookahead without heavy computation.

## Impact

The AI started:

1) leaving space for the I-piece

2) avoiding bad wells

3) choosing placements that improved future flexibility

This significantly boosted survival time.

## Conclusion

Combining the bug fixes, improved heuristics, and Beam Search resulted in a much stronger Tetris agent.
The final AI is stable, less greedy, and capable of planning ahead instead of reacting blindly.

Although the system is still simple compared to advanced Tetris AIs, the improvements are clear and measurable.