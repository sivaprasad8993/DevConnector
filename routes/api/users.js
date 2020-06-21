const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@Route     POST api/users
//@Desc      Registering a User
//@Access    Public

router.post('/', [
    check('name','name is required').not().isEmpty(),
    check('email','valid email is required').isEmail(),
    check('password','password should be atleast 6 digits long').isLength({min:6})
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const {name,email,password} = req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:'User Already Exist'}]});
        }

        const avatar = gravatar.url(email ,{
            l:"200",
            r:"pg",
            d:"mm"
        });

        user = new User({
            name,
            email,
            password,
            avatar
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        await user.save();

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