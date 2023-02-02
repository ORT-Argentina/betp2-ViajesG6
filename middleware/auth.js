require('dotenv').config();
const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const token = req.header('Token');
    try {
        jwt.verify(token, process.env.SECRET);
        next();
    } catch (error) {
        console.log('jwt must be provided')
        res.status(401).send({error: error.message});
        //401 = Desautorizado
    }
}

module.exports = auth;