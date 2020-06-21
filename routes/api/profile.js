const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

//@Route     GET api/profile/me 
//@Desc      Get Current users profile
//@Access    Private

router.get('/me', auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:'There is no Profile for this user'});
        }

        res.json(profile);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

//@Route     POST api/profile 
//@Desc      create or update current Users Profile
//@Access    Private

router.post('/',[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skiils is required').not().isEmpty()
]],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername)
      profileFields.githubusername = githubusername;

      if(skills){
        profileFields.skills =  skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        
        await profile.save();
        
        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
})

//@Route     GET api/profile 
//@Desc      get all Profiles
//@Access    Public

router.get('/',async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles); 
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
})

//@Route     GET api/profile/user/:user_id 
//@Desc      get Profile by user id
//@Access    Public

router.get('/user/:id',async (req,res) => {
    try {
        const profile = await Profile.findOne({user:req.params.id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'there is no profile for this user'});
        res.json(profile); 
    } catch (error) {
        if(error.kind === 'ObjectId') return res.status(400).json({msg:'there is no profile for this user'});
        res.status(500).send('server error');
    }
})


//@Route     Delete api/profile
//@Desc      delete user ,profile
//@Access    Private

router.delete('/',auth,async (req,res) => {
    try {
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id})
        res.json({msg:'user and Profile deleted'}); 
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
})

//@Route     Put api/profile/experience
//@Desc      add profile Experience
//@Access    Private

router.put('/experience',[auth,[
    check('title','title is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty()
]],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    const {
        title,
        company,
        from,
        to,
        current,
        location,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        from,
        to,
        current,
        location,
        description
    };

    try {
        const profile = await Profile.findOne({user:req.user.id});

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
})

//@Route     Delete api/profile/experience/:exp_id
//@Desc      Delete profile Experience
//@Access    Private

router.delete('/experience/:exp_id',auth,async (req,res) => {
    try {
        const profile =await Profile.findOne({user: req.user.id});

        const index = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(index,1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
})

// @route    PUT api/profile/educaton
// @ desc    Add Profile Education
// @acess      Private

router.put('/education' , [auth,
    [
        check('school','school is required').not().isEmpty(),
        check('degree','degree is required').not().isEmpty(),
        check('fieldofstudy','Field of Study  is required').not().isEmpty(),
        check('from','from date  is required').not().isEmpty()
    ]
] , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {school,degree,fieldofstudy,from,to,current,description} = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.msg);
        res.status(400).send('Server Error');
    }
})

// @route    Delete api/profile/education:edu_id
// @ desc    Delete Profile Education
// @acess      Private

router.delete('/education/:edu_id', auth,async (req,res) => {
    try {
        const profile = await Profile.findOne({user:req.user.id});

        const remove_index = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(remove_index,1);

        await profile.save();

        res.status(200).json(profile);
    } catch (error) {
        console.error(error.msg);
        res.status(400).send('Server Error');
    }
});


module.exports = router;