const dataUser = require('../data/userdb');

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
            res.status(401).json({ 'success': false, 'message': error.message}); //401 Indica desautorizado
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

module.exports = {getUsuarios, getUsuarioByID, signUpUsuario, loginUser, deleteUserByID, updatePassword}