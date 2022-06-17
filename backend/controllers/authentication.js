const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = db
 
router.post('/', async (req, res) => {
    
    let user = await User.findOne({
        where: { email: req.body.email }
    })

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ 
            message: `Could not find a user with the provided username and password` 
        })
    } else {
        const result = await jwt.sign({id: user.userId }, process.env.JWT_SECRET)
        res.json({ user: user, token: result.value })
        console.log(user)
    }
})

router.get('/profile', async (req, res) => {
    try {
        // Split the authorization header into [ "Bearer", "TOKEN" ]:
        const [authenticationMethod, token] = req.headers.authorization.split(' ')

        // Only handle "Bearer" authorization for now 
        //  (we could add other authorization strategies later):
        //if (authenticationMethod == 'Bearer') {

            // Decode the JWT
            console.log('i am a token', token)
            console.log(process.env.JWT_SECRET)
            const result = await jwt.verify(`${token}`, `${process.env.JWT_SECRET}`);
            

            // Get the logged in user's id from the payload
            console.log(`result ${result}`);
            const { id } = result.value //.value

            // Find the user object using their id:
            let user = await User.findOne({
                where: {
                    userId: id
                }
            })
            res.json(user)
        //}
    } catch(err) {
        res.json(err);
    }
})





module.exports = router
