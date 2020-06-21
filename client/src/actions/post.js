import axios from 'axios';
import {setAlert} from './alert';
import {GET_POSTS,POST_ERROR, UPDATE_LIKES, DELETE_POST ,ADD_POST , GET_POST ,ADD_COMMENT,REMOVE_COMMENT} from './types';

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//add like
export const addLike = postId => async dispatch => {
    console.log('add Like');
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);

        console.log(res);

        dispatch({
            type: UPDATE_LIKES,
            payload: {postId , likes: res.data}
        })
    } catch (error) {
        console.log('error in actions');
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//Remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);

        console.log(res);

        dispatch({
            type: UPDATE_LIKES,
            payload: {postId , likes: res.data}
        })
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//delete post
export const deletePost = postId => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${postId}`);

        console.log(res);

        dispatch({
            type: DELETE_POST,
            payload: postId
        })

        dispatch(setAlert('Post has been removed' , 'success'));
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//ADD post
export const addPost = formData => async dispatch => {

    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify(formData);
    try {
        const res = await axios.post(`/api/posts`,body,config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post Created' , 'success'));
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//get post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//ADD Comment
export const addComment = (postId , formData) => async dispatch => {

    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify(formData);
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`,body,config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment Added' , 'success'));
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}

//Delete Comment
export const removeComment = (postId , commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert('Comment Removed' , 'success'));
    } catch (error) {
        dispatch({type: POST_ERROR,
        payload: {msg: error.response.statusText , status: error.response.text}})
    }
}