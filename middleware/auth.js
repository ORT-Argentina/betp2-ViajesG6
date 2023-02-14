require('dotenv').config();
const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const token = req.header('Token');
    try {
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.log('jwt must be provided')
        res.status(401).send({error: error.message});
        //401 = Desautorizado
    }
}

module.exports = auth;