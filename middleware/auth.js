const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
     
    try {
        const token = req.header('x-auth-token');
        if(!token){
            return res.status(401).json({msg:'No token found'});
        }
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;
    } catch (error) {
        return res.status(401).json({msg:'invalid Token found'});
    }

    next();
}