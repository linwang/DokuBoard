import { actionTypes } from "../actions/actions";
const initialState = {
    loading: false,
    board: null,
    grid: [],
    error: ''
};
const boardReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.LOAD_FILE_REQUEST:            
            return {... state, loading: true};
        case actionTypes.LOAD_FILE_SUCCESS: 
            return {                
                loading: false,
                board: action.payload,
                grid: action.payload.getGrid(),
                error: ''
            }
        case actionTypes.LOAD_FILE_FAIL:
            return {
                ...state, 
                loading: false,
                error: action.payload
            }
        case actionTypes.SOLVE:
            state.board.solve();
            return {
                ... state,
                grid: state.board.getGrid()         
            };
        default:
            return state;
    }
}

export default boardReducer;