//Define the order in which to examine/expand possible moves
//(This affects alpha-beta pruning performance)
//let move_expand_order=[0,1,2,3,4,5,6,7,8]; //Naive (linear) ordering
//let move_expand_order=[4,0,1,2,3,5,6,7,8]; //Better ordering?
//let move_expand_order=[1,3,5,7,0,2,6,8,4]; //Worst ordering?
let move_expand_order=[4,8,6,2,0,1,3,5,7];
/////////////////////////////////////////////////////////////////////////////
//Utilize the Minimax Algorithm to play tic-tac-toe
function tictactoe_minimax(board,cpu_player,cur_player) {
  //BASE CASE
  if(is_terminal(board)) //Stop if game is over
    return {
      move:null,
      score:utility(board,cpu_player) //How good was this result for us?
    }

  ++helper_expand_state_count; //DO NOT REMOVE
  //Keep track of the best move and it's utility
  let bestVal = 0;
  let bestMove = 0;

  //Get the ideal value based on who's turn it is
  if(cur_player == cpu_player){
    bestVal = -Infinity;
   }
   else {
    bestVal = Infinity;
   }

  //GENERATE SUCCESSORS
  for(let move of move_expand_order) { //For each possible move (i.e., action)
    if(board[move]!=-1) continue; //Already taken, can't move here (i.e., successor not valid)
    
    let new_board=board.slice(0); //Copy
    new_board[move]=cur_player; //Apply move
    //Successor state: new_board

    //RECURSION
    // What will my opponent do if I make this move?
    let results=tictactoe_minimax(new_board,cpu_player,1-cur_player);

   //If the player is trying to maximize score
   if(cur_player == cpu_player){
    if(results.score > bestVal){ 
      bestVal = results.score;
      bestMove = move;
    }
   }
   //If the player is trying to minimize score
   else {
    if(results.score < bestVal){ 
      bestVal = results.score;
      bestMove = move;
    }
   }
  }
  //Return results gathered from all sucessors (moves).
  //Which was the "best" move?  
  return {
    move: bestMove/* What do you return here? */,
    score: bestVal/* And here? */
  };
}
//Function to determine whether the game is over
function is_terminal(board) {
  ++helper_eval_state_count; //DO NOT REMOVE
  for(i = 0; i < 3; i++){
    x = 3*i;
    //Check horizontal combinations
    if(board[x] == board[x+1] && board[x+2] == board[x] && board[x] != -1){
      return(true);
    }
    //Check vertical combinations
    if(board[i] == board[3+i] && board[6+i] == board[i] && board[i] != -1){
      return(true);
    }
  }
  //Check Diagonal Cases
  diag1 = (board[0] == board[4] && board[4] == board[8] && board[0] != -1);
  diag2 = (board[2] == board[4] && board[4] == board[6] && board[2] != -1);

  if(diag1 || diag2){
    return(true);
  }

// Look for draw
  draw = true;
  for(i = 0; i < 9; i++){
    if(board[i] == -1){
      draw = false;
    }
  }
  return draw;
}
//Determine whether the given board is a draw
function isDraw(board){
  for(i = 0; i < 3; i++){
    x = 3*i;
    //Check horizontal combinations
    if(board[x] == board[x+1] && board[x+2] == board[x] && board[x] != -1){
      return(false);
    }
    //Check vertical combinations
    if(board[i] == board[3+i] && board[6+i] == board[i] && board[i] != -1){
      return(false);
    }
  }
  //Check Diagonal Cases
  diag1 = (board[0] == board[4] && board[4] == board[8] && board[0] != -1);
  diag2 = (board[2] == board[4] && board[4] == board[6] && board[2] != -1);

  if(diag1 || diag2){
    return(false);
  }
// This function should only be called in the case 
// of a terminal board so draw is last possible outcome
  return true;
}
function utility(board,player) {
  /***********************
  * TASK: Implement the utility function
  *
  * Return the utility score for a given board, with respect to the indicated player
  *
  * Give score of 0 if the board is a draw
  * Give a positive score for wins, negative for losses.
  * Give larger scores for winning quickly or losing slowly
  * For example:
  *   Give a large, positive score if the player had a fast win (i.e., 5 if it only took 5 moves to win)
  *   Give a small, positive score if the player had a slow win (i.e., 1 if it took all 9 moves to win)
  *   Give a small, negative score if the player had a slow loss (i.e., -1 if it took all 9 moves to lose)
  *   Give a large, negative score if the player had a fast loss (i.e., -5 if it only took 5 moves to lose)
  * (DO NOT simply hard code the above 4 values, other scores are possible. Calculate the score based on the above pattern.)
  * (You may return either 0 or null if the game isn't finished, but this function should never be called in that case anyways.)
  *
  * Hint: You can find the number of turns by counting the number of non-blank spaces
  *       (Or the number of turns remaining by counting blank spaces.)
  ***********************/
 //Check if draw
  if(isDraw(board)){
    return(0);
  }
  //Find the number of turns taken
  let turnCt = 0;
  let WLfactor = 1;
  for(i = 0; i < 9; i++){
    if(board[i] != -1){
      turnCt++;
    }
  }
  //Determine if player is the winner
  if(turnCt % 2 == player){
    WLfactor = -1;
  }
  return(WLfactor*(10-turnCt));
}

function tictactoe_minimax_alphabeta(board,cpu_player,cur_player,alpha,beta) {
  /***********************
  * TASK: Implement Alpha-Beta Pruning
  *
  * Once you are confident in your minimax implementation, copy it here
  * and add alpha-beta pruning. (What do you do with the new alpha and beta parameters/variables?)
  *
  * Hint: Make sure you update the recursive function call to call this function!
  ***********************/
  //BASE CASE
  if(is_terminal(board)) //Stop if game is over
    return {
      move:null,
      score:utility(board,cpu_player) //How good was this result for us?
    }

  ++helper_expand_state_count; //DO NOT REMOVE
  let bestVal = 0;
  let bestMove = 0;

  //Make sure alpha and beta have values
  if(alpha == null) alpha = -Infinity;
  if(beta == null) beta = Infinity;
  
  //Find the starting value for bestVal
  if(cur_player == cpu_player){
    bestVal = -Infinity;
   }
   else {
    bestVal = Infinity;
   }
  //GENERATE SUCCESSORS
  for(let move of move_expand_order) { //For each possible move (i.e., action)
    if(board[move]!=-1) continue; //Already taken, can't move here (i.e., successor not valid)
    
    let new_board=board.slice(0); //Copy
    new_board[move]=cur_player; //Apply move
    //Successor state: new_board

    //RECURSION
    // What will my opponent do if I make this move?
    let results=tictactoe_minimax_alphabeta(new_board,cpu_player,1-cur_player,alpha,beta);

   //If the current player is trying to maximize score
   if(cur_player == cpu_player){
     //Update alpha if necessary
     alpha = Math.max(alpha, results.score);
    if(results.score > bestVal){ 
      bestVal = results.score;
      bestMove = move;
    }
   }
   else {
     //Update beta if necessary
     beta = Math.min(beta, results.score);
    if(results.score < bestVal){ 
      bestVal = results.score;
      bestMove = move;
    }
   }
   //If alpha > beta then this board no longer needs to be expanded
   if(alpha > beta){
     //Return the worst possible non-null utility value so it can be ignored
     let value = (cur_player == cpu_player)? Infinity : -Infinity
     return{
       move : move,
       score : value
     };
   }
  }

  //Return results gathered from all successors (moves).
  //Which was the "best" move?  
  return {
    move: bestMove/* What do you return here? */,
    score: bestVal/* And here? */
  };
}

function debug(board,human_player) {
  /***********************
  * This function is run whenever you click the "Run debug function" button.
  *
  * You may use this function to run any code you need for debugging.
  * The current "initial board" and "human player" settings are passed as arguments.
  *
  * (For the purposes of grading, this function will be ignored.)
  ***********************/
  helper_log_write("Testing board:");
  helper_log_board(board);
  
  let tm=is_terminal(board);
  helper_log_write("is_terminal() returns "+(tm?"true":"false"));

  let u=utility(board,human_player);
  helper_log_write("utility() returns "+u+" (w.r.t. human player selection)");
}
