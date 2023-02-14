var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const {getUsuarios, getUsuarioByID, signUpUsuario, loginUser, deleteUserByID, updatePassword} = require('../controllers/usersController');

// GET usuarios listing
router.get('/',
auth,
getUsuarios);

// GET usuario por ID
router.get('/:id',
check('id').exists().isLength({min: 24, max:24}).withMessage("El ID debe ser de 24 caracteres de largo"),
getUsuarioByID
);

// Registro
router.post('/signup',
check('nombre').exists(),
check('apellido').exists(),
check('email').exists(),
check('password').exists(),
check('fecha_nacimiento').isISO8601().withMessage("El formato de la fecha debe ser ISO 8601 (YYYY-MM-DD)"),
signUpUsuario
);

// Login
router.post('/login',
check('email').exists().withMessage('Debes ingresar un email'),
check('password').exists().withMessage('Debes ingresar una contraseña'),
loginUser
);

// Comprar vuelo
router.post('/comprarVuelo/:id',
check('id').exists().withMessage('Debes ingresar un id de vuelo'),
check('pasajeros').exists().withMessage('Debes ingresar un numero de pasajeros').isInt().withMessage('Debe ser numerico'),
auth,
comprarVuelo)

// Cancelar vuelo
router.post('/cancelarVuelo/:id',
check('id').exists().withMessage('Debes ingresar un id de vuelo'),
auth,
cancelarVuelo)

// UPDATE user
// router.put('/:id', async (req, res) => {
//     //TODO Validacion
//     let id = req.params.id;
//     let usuario = req.body;
//     usuario._id = id;
//     usuario = await dataUser.updateUsuario(usuario);
//     res.json(usuario);
// });

// UPDATE password
router.put('/updatePassword/:id',
check('id').exists().isLength({min: 24, max:24}).withMessage("El ID debe ser de 24 caracteres de largo"),
check('password').exists().withMessage('Debes ingresar una contraseña'),
updatePassword
);

// DELETE usuario por ID
router.delete('/deleteUser/:id',
auth,
check('id').exists().isLength({min: 24, max:24}).withMessage("El ID debe ser de 24 caracteres de largo"),
deleteUserByID
);


module.exports = router