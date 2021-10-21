const express = require('express')
const {check, validationResult} = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require("../../models/User")

const router = express.Router()

// @desc: Register user

// validating the inputs required
router.post("/",[
    check('name',"name is required")
    .not()
    .isEmpty(),
    check('email',"Please type the right email")
    .isEmail(),
    check('password',"password should be more then 6 charcters")
    .isLength({min:6})
    
],async (req,res)=>{
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }
    // destructuring things from req.body so i don't have to call req.body all the time
    const {name, email, password} = req.body

    try {
    // checking the user existence
    let user = await User.findOne({email})  

    if(user){
        return res.status(400).json({msg:'user already exist'})
    }

    // getting users gravatar

    const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    })

    // encrypting pass
    const salt = await bcrypt.genSalt(10)

    user.password = await bcrypt.hash(password, salt)
    
    await user.save()

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