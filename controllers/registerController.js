const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);

        // Auto-login after registration
        // Convert roles object to array format to match login
        const roles = Object.values(result.roles).filter(Boolean);

        // Create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": result.username,
                    "roles": roles  // This will be [2001] like in login
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );

        const refreshToken = jwt.sign(
            { "username": result.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save refreshToken with current user
        result.refreshToken = refreshToken;
        await result.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send authorization roles and access token to user
        res.status(201).json({
            'success': `New user ${user} created and logged in`,
            roles,  // This will be [2001] array format
            accessToken
        });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };