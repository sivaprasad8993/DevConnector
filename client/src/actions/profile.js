import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILES } from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.data.msg }
        })
    }
}

export const getProfiles = () => async dispatch => {

    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

//Get profile by id
export const getProfileById = userId => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.data.msg }
        })
    }
}

//Get github repos
// export const getGithubRepos = username => async dispatch => {

//     try {
//         const res = await axios.get(`api/profile/github/${username}`);

//         dispatch({
//             type: GET_REPOS,
//             payload: res.data
//         })
//     } catch (error) {
//         dispatch({
//             type: PROFILE_ERROR,
//             payload: { msg: error.response.statusText, status: error.response.status }
//         })
//     }
// }

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile Updated Succesfully' : 'Profile Created Succesfully', 'success'));

        !edit && history.push('/dashboard');

    } catch (error) {
        const errors = error.response.data.errors;

        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
            type: PROFILE_ERROR
        })
    }
}

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experince added Successfully', 'success'));

        history.push('/dashboard');

    } catch (error) {
        const errors = error.response.data.errors;

        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
            type: PROFILE_ERROR
        })
    }
}

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education added Successfully', 'success'));

        history.push('/dashboard');

    } catch (error) {
        const errors = error.response.data.errors;

        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        dispatch({
            type: PROFILE_ERROR
        })
    }
}

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience successfully deleted', 'ssuccess'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.data.msg }
        })
    }
}

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education successfully deleted', 'ssuccess'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.data.msg }
        })
    }
}

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure?')) {
        try {
            const res = await axios.delete(`/api/profile`);

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: DELETE_ACCOUNT });

            dispatch(setAlert('Your account is deleted successfully', 'success'));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
    }
}
