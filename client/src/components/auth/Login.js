import React,{Fragment,useState} from 'react';
import {Link} from 'react-router-dom';
import Input from '../common/Input';
import Joi from 'joi-browser';
import {login} from '../../actions/auth';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {loadUser} from '../../actions/auth';

const Login = ({login,isAuthenticated,loadUser}) => {
    const [formData,setFormData] = useState({
        email:'',
        password:''
    });

    const [errors,setErrors] = useState({
        email:'',
        password:''
    })

    const {email,password} = formData;

    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }),
        password: Joi.string().alphanum().min(6).required()
    }

    const validate = ({name,value}) => {
        const obj = {[name]:value};
        const s = {[name]:schema[name]};
        const {error} = Joi.validate(obj,s);
        return error ? error.details[0].message : null;
    }

    const onChange = e => {
        const error = validate(e.target);
        if(error) setErrors({...errors,[e.target.name]:error});
        else setErrors({...errors,[e.target.name]:""})
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const onSubmit = e => {
        e.preventDefault();
        login({email,password});
    }  

    if(isAuthenticated){
        return <Redirect to='/dashboard' />
    }

    return ( 
            <Fragment>
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fa fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit = {e => onSubmit(e)}>
                    <Input name="email" placeholder="Email" value={email} onChange={onChange} errors={errors}/>
                    <Input name="password" placeholder="Password" value={password} onChange={onChange} type="password" errors={errors}/>
                    <input type="submit" className="btn btn-primary" value="Login"/>
                </form>
                <p className="my-1">
                    Dont have an account? <Link to="/register">Sign Up</Link>
                </p>
        </Fragment>
     );
}

Login.propTypes = {
    login:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


 
export default connect(mapStateToProps,{login,loadUser})(Login);