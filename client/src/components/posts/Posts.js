import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { setAuthToken } from "../../utils/setAuthToken";

const Posts = ({ post: { posts, loading }, getPosts }) => {
    useEffect(() => {
        setAuthToken(localStorage.token);
        getPosts();
    }, [getPosts]);
    return (
        loading ? <Spinner /> : (
            <Fragment>
                <h1 className='large text-primary'>Posts</h1>
                <p className="lead">
                    <i className='fa fa-user'></i> Welcome to the Community
            </p>
                <PostForm />
                <div className="posts">
                    {
                        posts.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))
                    }
                </div>
            </Fragment>)
    )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts);
