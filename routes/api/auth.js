const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

router.get("/",auth,async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})

// @desc: Authenticate user & getting the token

// validating the inputs required
router.post("/",[
    check('email',"Please type the right email")
    .isEmail(),
    check('password',"password required")
    .exists()
    
],async (req,res)=>{
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }
    // destructuring things from req.body so i don't have to call req.body all the time
    const {email, password} = req.body

    try {
    // checking the user existence
     let user = await User.findOne({email})  

    if(!user){
        return res.status(400).json({msg:'Invalid Credentials'})
    }

    // Matching the password

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        return res.status(400).json({msg:'Invalid Credentials'})
    }

    
    // returning jsonwebtoken

    const payload = {
        user:{
            id: user.id
        }
    }

    jwt.sign(
        payload, 
        config.get('recipe'),
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err
            res.json({token})
        }
        )

    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error')
    }

})


module.exports = router