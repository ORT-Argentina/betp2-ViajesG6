const connection = require('./connection');
let objectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DBNAME = 'sample_tp2';
const COLLECTION = 'usuarios'

async function getUsuarios() {
    const clienteMongo = await connection.getConnection();

    const Usuarios = await clienteMongo.db(DBNAME).collection(COLLECTION).find()
        .toArray();
    return Usuarios;
}

async function getUsuario(id) {
    const clienteMongo = await connection.getConnection();
    const usuario = await clienteMongo.db(DBNAME).collection(COLLECTION)
        .findOne({_id: new objectId(id)});

    if(!usuario){ 
        throw new Error('Usuario no registrado') 
    }   

    return usuario;
}

async function addUsuario(usuario) {
    const clienteMongo = await connection.getConnection();
    usuario.password = bcrypt.hashSync(usuario.password, 8);
    
    const agregar = await clienteMongo.db(DBNAME).collection(COLLECTION)
        .insertOne(usuario);
    return agregar;
}

async function verifyUserByEmail(email) {
    const clienteMongo = await connection.getConnection();

    const user = await clienteMongo.db(DBNAME)
        .collection(COLLECTION)
        .findOne({email:email});

        if (user){
            // return res.status(422).json({ errors: 'Ya existe un usuario con el email ' + email });
            throw new Error('Ya existe un usuario con el email ' + email);
        }

    return user;
}

async function findByCredentials(email, password){
    const clienteMongo = await connection.getConnection();
    console.log(email);
    const user = await clienteMongo.db(DBNAME)
        .collection(COLLECTION)
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
    const token = jwt.sign({_id: user._id, email: user.email}, process.env.SECRET, {expiresIn: '3h'});
    return token;
}

async function updateUsuario(usuario) {
    const clienteMongo = await connection.getConnection();
    const query = {_id: new objectId(usuario._id)};
    const newvalues = {
        $set: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            fecha_nacimiento: usuario.fecha_nacimiento,
            email: usuario.email
        }
    };
    const actualizar = await clienteMongo.db(DBNAME).collection(COLLECTION)
        .updateOne(query,newvalues);
    return actualizar;
}

async function updatePassword(id, password){
    const query = { _id: new objectId(id) };
    const passwordHash = await bcrypt.hash(password, 8);
    const newValues = {
        $set: {
            password: passwordHash,
        }
    };
    const connectdb = await connection.getConnection();
    const result = await connectdb.db(DBNAME)
                                     .collection(COLLECTION)
                                     .updateOne(query, newValues);
    return result;
};

// async function updateUser(user) {
//     const query = { _id: new objectId(user._id) };

//     const parameters = ['email', 'password', 'birth_date'];

//     let newValues = {
//         $set: {}
//     }

//     // At least one of the parameters is present in the request body
//     if (parameters.some(param => request.body.hasOwnProperty(param))) {
//         if (param == 'password') {
//             const passwordHash = await bcrypt.hash(user.password, 8);
//         }

//     }

//     const connectdb = await connection.getConnection();
//     const result = await connectdb.db(DATABASE)
//                                      .collection(USERS)
//                                      .updateOne(query, newValues);
//     return result;
// }

async function deleteUsuario(id) {
    const clienteMongo = await connection.getConnection();
    const borrar = await clienteMongo.db(DBNAME).collection(COLLECTION).deleteOne({_id: new objectId(id)}); 
    return borrar;
}

async function comprarVuelo(user, flight, pasajeros) {
    const clienteMongo = await connection.getConnection();

    if (flight.asientosDisponibles < pasajeros) {
        throw new Error(`Asientos disponibles insuficientes. Pasajeros: ${pasajeros} - Asientos disponibles en el vuelo: ${flight.asientosDisponibles}`);
    }

    const totalMillas = flight.millas * pasajeros;
    if (user.millas < totalMillas) {
      throw new Error(`Millas insuficientes. Millas del usuario: ${user.millas} - Total millas a gastar: ${totalMillas}`);
    }

    // In this code, the $each operator is used to append the modified 'flight' object to the 'vuelos_comprados' array, and the 
    // $set operator is used to remove the 'asientosDisponibles' attribute from the 'flight' object before adding it to the array.

    const flightCopy = {...flight, pasajeros, millasGastadas: totalMillas};
    delete flightCopy.asientosDisponibles;
    delete flightCopy.millas;

    const updatedUser = await clienteMongo.db(DBNAME).collection(COLLECTION).updateOne(
        { _id: new objectId(user._id) },
        { $inc: { millas: -totalMillas }, $push: { vuelos_comprados: flightCopy } }
    );

    if (updatedUser.modifiedCount !== 1) {
      throw new Error("No se pudo realizar la compra. Por favor verificar.");
    }

    return updatedUser;
}

async function cancelarVuelo (user, vuelo) {
    const clienteMongo = await connection.getConnection();

    // Refund the 'millasGastadas' to the 'millas' attribute y sacar el vuelo de la lista de vuelos_comprados
    const updatedUser = await clienteMongo.db(DBNAME).collection(COLLECTION).updateOne(
        { _id: new objectId(user._id) },
        { $inc: { millas: vuelo.millasGastadas }, $pull: { vuelos_comprados: { _id: new objectId(vuelo._id) } } }
    ); 
    return updatedUser;
}


module.exports = { getUsuarios, getUsuario, addUsuario, updateUsuario, updatePassword, 
                    deleteUsuario, findByCredentials, generateJWT, verifyUserByEmail, comprarVuelo, cancelarVuelo };