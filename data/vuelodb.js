const connection = require('./connection');
let objectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbName = 'sample_tp2';

async function getVuelos() {
    const clienteMongo = await connection.getConnection();

    const vuelos = await clienteMongo.db(dbName)
    .collection('vuelos').find()
    .toArray();
    return vuelos;
}

async function getVuelo(id) {
    const clienteMongo = await connection.getConnection();
    const vuelo = await clienteMongo.db(dbName).collection('vuelos')
        .findOne({_id: new objectId(id)});

    if(!vuelo){ 
        throw new Error('Vuelo no registrado') 
    }   
    return vuelo;
}

async function addVuelo(vuelo) {
    const clienteMongo = await connection.getConnection();
    const agregar = await clienteMongo.db(dbName).collection('vuelos')
        .insertOne(vuelo);
    return agregar;
}

async function updateVuelo(vuelo) {
    const clienteMongo = await connection.getConnection();
    const query = {_id: new objectId(vuelo._id)};
    const newvalues = {
        $set: {
            origen: vuelo.origen,
            destino: vuelo.destino,
            duracion: vuelo.duracion,
            precio: vuelo.precio
        }
    };
    const actualizar = await clienteMongo.db(dbName).collection('vuelos')
        .updateOne(query,newvalues);
    return actualizar;
}

async function findByCredentials(email, password){
    const clienteMongo = await connection.getConnection();

    const user = await clienteMongo.db(dbName)
        .collection('users')
        .findOne({email:email});

        if (!user){
            throw new Error('Usuario inexistente');
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch){
            throw new Error('Password invalida');
        }

        return user;
}

async function generateJWT(user) {
    const token = jwt.sign({_id: user._id, email: user.email}, process.env.SECRET, {expiresIn: '1h'});
    return token;
}

async function deleteVuelo(vuelo) {
    const clienteMongo = await connection.getConnection();
    const borrar = await clienteMongo.db(dbName).collection('vuelos').deleteOne({_id: new objectId(id)}); 
    return borrar;
}


module.exports = { getVuelos, getVuelo, addVuelo, updateVuelo, deleteVuelo, findByCredentials, generateJWT };
