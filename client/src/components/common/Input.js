import React from 'react';

const Input = ({placeholder,name,value,onChange,errors,type="text"}) => {
    return ( 
        <div className="form-group">
            <input type={type} placeholder={placeholder} name={name} value={value} onChange={e =>onChange(e)}/>
            {errors[name] && <div className='alert alert-danger'>{errors[name]}</div>}
        </div>
     );
}
 
export default Input;