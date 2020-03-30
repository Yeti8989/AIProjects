//Perform breadth-first search from initial state, using defined "is_goal_state"
//and "find_successors" functions
//Returns: null if no goal state found
//Returns: object with two members, "actions" and "states", where:
//  actions: Sequence(Array) of action ids required to reach the goal state from the initial state
//  states: Sequence(Array) of states that are moved through, ending with the reached goal state (and EXCLUDING the initial state)
//  The actions and states arrays should both have the same length.
function astar_search(initial_state) {
  let open = new FastPriorityQueue(function(a,b) { return a.estimated_total_cost < b.estimated_total_cost; });
  let closed = new Set();
  let fixed_step_cost = 1; //Assume action cost is constant
  /***Your code for A* search here***/
  let state = initial_state;
  let curState = {
    prevState : null,
    estimated_total_cost : calculate_heuristic(initial_state),
    pathCost : 0
  };
  closed.add(state_to_uniqueid(initial_state));
  while(!is_goal_state(state)){
    let sucs = find_successors(state);
    for(suc in sucs){
      let bigState={
        prevState : curState,
        newState : sucs[suc].resultState,
        actionID : sucs[suc].actionID,
        estimated_total_cost : curState.pathCost + calculate_heuristic(sucs[suc].resultState),
        pathCost : curState.pathCost + fixed_step_cost
      };
      if(!closed.has(state_to_uniqueid(bigState.newState))){
        open.add(bigState);
      }
    }
    curState = open.peek();
    open.poll();
    state = curState.newState;
    if(!closed.has(state_to_uniqueid(curState.newState))){
      closed.add(state_to_uniqueid(curState.newState));
    }
  }
  let actionArray = []
  let stateArray = []
  while(curState.prevState != null){
    actionArray.unshift(curState.actionID);
    stateArray.unshift(curState.newState);
    curState = curState.prevState;
  }
  return {
    actions : actionArray,
    states : stateArray
  };
  //No solution found
  return null;
}
