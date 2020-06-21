import React,{Fragment,useState} from 'react';
import {Link,Redirect} from 'react-router-dom';
import Input from '../common/Input';
import Joi from 'joi-browser';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import PropTypes from 'prop-types';
import {register} from '../../actions/auth';
import {loadUser} from '../../actions/auth';



const Register = ({setAlert,register,isAuthenticated,loadUser}) => {
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    const [errors,setErrors] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    })

    const {name,email,password,password2} = formData;

    const schema = {
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainAtoms: 2 }),
        password: Joi.string().alphanum().min(6).required(),
        password2:Joi.string().alphanum().min(6).required()
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
        console.log(formData);
        if(password !== password2){
            setAlert('passwords do not match!','danger');
        }
        else {
            register({name,email,password});
            loadUser();
        }
    }

    if(isAuthenticated){
        return <Redirect to='/dashboard' />
    }

    return ( 
            <Fragment>
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fa fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit = {e => onSubmit(e)}>
                    <Input name="name" placeholder="Name" value={name} onChange={onChange} errors={errors}/>
                    <Input name="email" placeholder="Email" value={email} onChange={onChange} errors={errors}/>
                    <Input name="password" placeholder="Password" value={password} onChange={onChange} type="password" errors={errors}/>
                    <Input name="password2" placeholder="Password2" value={password2} onChange={onChange} type="password" errors={errors}/>
                    <input type="submit" className="btn btn-primary" value="Register"/>
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
        </Fragment>
     );
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
    loadUser:PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated:state.auth.isAuthenticated
})
 
export default connect(mapStateToProps,{setAlert,register,loadUser})(Register);