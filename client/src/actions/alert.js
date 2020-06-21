import {SET_ALERT,REMOVE_ALERT} from '../actions/types';


export const setAlert = (msg,alertType) => dispatch => {
    const id = Math.floor(Math.random()*10000000);

    dispatch({
        type:SET_ALERT,
        payload:{id,msg,alertType}
    })

    setTimeout(() => dispatch({type:REMOVE_ALERT,payload:id}),5000);
}
