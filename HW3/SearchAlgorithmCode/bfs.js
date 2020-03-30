//Perform breadth-first search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and EXCLUDING the initial state)
//  The actions and states arrays should both have the same length.
function breadth_first_search(initial_state) {
  let open = []; //See push()/pop() and unshift()/shift() to operate like stack or queue
                 //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  let closed = new Set(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  /***Your code for breadth-first search here***/
  let state = initial_state;
  let curState = 1;
  closed.add(state_to_uniqueid(initial_state));
  while(!is_goal_state(state)){
    let sucs = find_successors(state);
    for(suc in sucs){
      let bigState={
        prevState : curState,
        newState : sucs[suc].resultState,
        actionID : sucs[suc].actionID
      };
      if(!closed.has(state_to_uniqueid(bigState.newState))){
        open.unshift(bigState);
      }
    }
    curState = open.pop();
    state = curState.newState;
    if(!closed.has(state_to_uniqueid(curState.newState))){
      closed.add(state_to_uniqueid(curState.newState));
    }
  }
  /***Your code to generate solution path here***/
  let actionArray = []
  let stateArray = []
  while(curState != 1){
    actionArray.unshift(curState.actionID);
    stateArray.unshift(curState.newState);
    curState = curState.prevState;
  }
  return {
    actions : actionArray,
    states : stateArray
  };
  //OR
  //No solution found
  return null;
}
