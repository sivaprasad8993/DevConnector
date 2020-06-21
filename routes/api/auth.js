const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');

//@Route     GET api/auth
//@Desc      Get Auth User
//@Access    Private

router.get('/', auth ,async (req,res) => {
    try {
       const user = await User.findById(req.user.id).select('-password');
       res.json(user); 
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Server Error'});
    }
});

//@Route     POST api/auth
//@Desc      Authenticate a User & get token
//@Access    Public

router.post('/', [
    check('email','valid email is required').isEmail(),
    check('password','password is required').not().isEmpty()
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }


        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({errors:[{msg:"Invalid Credentials"}]});
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload , 
        config.get('jwtSecret'),
        {expiresIn:3600000},
        (err,token) => {
            if(err) throw err;
            res.json({token});
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({errors: [{msg:'Server Error'}]});
    }
});

module.exports = router;