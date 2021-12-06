import { KendokuBoard } from "../kendoku";

export const actionTypes = {LOAD_FILE_REQUEST: 'LOAD_FILE_REQUEST', LOAD_FILE_SUCCESS: 'LOAD_FILE_SUCCESS', LOAD_FILE_FAIL: 'LOAD_FILE_FAIL', SOLVE: 'SOLVE'};

export const loadFileRequest = (e) => {
    return {
        type: actionTypes.LOAD_FILE_REQUEST,
        payload: e
    };
}
export const loadFileSuccess = (board) => {
    return {
        type: actionTypes.LOAD_FILE_SUCCESS, 
        payload: board
    };
}

export const loadFileFail = (error) => {
    return {
        type: actionTypes.LOAD_FILE_FAIL,
        payload: error
    }
}

export const loadFile = (e) => {
    return function(dispatch) {
    const file = e.target.files[0];
    if(!file) {            
        dispatch(loadFileFail('Failed to find file'));
    }
    let reader = new FileReader();
    reader.onload = function(e) {
    const content = e.target.result;
    if(content == null)
        dispatch(loadFileFail('Failed to load file'));
    let board = new KendokuBoard(content);
    if(board == null)
        dispatch(loadFileFail('Failed to load board'));
    dispatch(loadFileSuccess(board));
    }
    reader.readAsText(file);    
    }
}

export const solve = () => {
    return {
        type: actionTypes.SOLVE        
    };
}