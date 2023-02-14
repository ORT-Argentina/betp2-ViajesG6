const dataUser = require('../data/userdb');
const dataVuelos = require('../data/vuelodb');

getUsuarios = async function (req, res) {

    const usuarios = await dataUser.getUsuarios();
    res.json(usuarios);
}

getUsuarioByID = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            const usuario = await dataUser.getUsuario(req.params.id);
            res.json(usuario);
    
        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message});
        }
    }
}

signUpUsuario = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            let usuarioConEmailExiste = await dataUser.verifyUserByEmail(req.body.email);

            req.body.millas = 0;
            req.body.vuelos_comprados = [];

            const usuario = await dataUser.addUsuario(req.body);
            res.json(usuario);

        } catch (error) {
            res.status(422).json({ 'success': false, 'message': error.message});
        }
    }
}

loginUser = async function (req, res) {

    if (req.verifyParametersQuery()) {
        try {
            const user = await dataUser.findByCredentials(req.body.email, req.body.password);
            const token = await dataUser.generateJWT(user);
    
            res.send({user, token});
    
        } catch (error) {
            res.status(401).json({ 'success': false, 'message': error.message});
        }
    }
}

deleteUserByID = async function (req, res) {

    if (req.verifyParametersQuery()) {

        try {
            const usuario = await dataUser.getUsuario(req.params.id);
            await dataUser.deleteUsuario(req.params.id);
            res.send('Usuario eliminado');

        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message});
        }
    }
}

updatePassword = async function (req, res) {

    if (req.verifyParametersQuery()) {
        try {
            const usuario = await dataUser.getUsuario(req.params.id);
            await dataUser.updatePassword(req.params.id, req.body.password)
            res.send('Se actualizó la contraseña del usuario');

        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message});
        }

    }
}

comprarVuelo = async function (req, res) {

    if (req.verifyParametersQuery()) {
        try {

            const user = await dataUser.getUsuario(req.user._id);
            const vuelo = await dataVuelos.getVuelo(req.params.id);

            await dataUser.comprarVuelo(user, vuelo, req.body.pasajeros)
            await dataVuelos.restarAsientos(req.params.id, req.body.pasajeros)
            
            res.status(200).json({ 'success': true, 'message': 'La compra se realizó con éxito' });

        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message });
        }
    }
}

cancelarVuelo = async function (req, res) {

    if (req.verifyParametersQuery()) {
        try {

            const user = await dataUser.getUsuario(req.user._id);
            await dataVuelos.getVuelo(req.params.id);

            // Encuentra el vuelo con un vueloId en el array de 'vuelos_comprados'
            const vuelo = user.vuelos_comprados.find(vuelo => vuelo._id.toString() === req.params.id);

            await dataUser.cancelarVuelo(user, vuelo)
            await dataVuelos.sumarAsientos(req.params.id, vuelo.pasajeros)
            
            res.status(200).json({ 'success': true, 'message': 'La cancelación se realizó con éxito' });

        } catch (error) {
            res.status(404).json({ 'success': false, 'message': error.message });
        }
    }
}


module.exports = {getUsuarios, getUsuarioByID, signUpUsuario, loginUser, deleteUserByID, updatePassword, comprarVuelo, cancelarVuelo}