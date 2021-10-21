const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next)=>{
    // get token from header

    const token =req.header('x-auth-token')
    // if no token
    if(!token){
        return res.status(401).json({msg:"no token, authorization denied"})
    }

    // verify token

    try {
        const decoded = jwt.verify(token,config.get('recipe'))
        
        req.user = decoded.user;
        next()
        
    } catch (error) {
        return res.status(401).json({msg:'invalid token'})        
    }
}