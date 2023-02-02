var express = require('express');
var router = express.Router();
const dataVuelo = require('../data/vuelodb');
const auth = require('../middleware/auth');

// const {} = require('../controllers/vuelosController');

/* GET vuelos listing. */
router.get('/', auth, async (req, res) => {
    const vuelos = await dataVuelo.getVuelos();
    res.json(vuelos);
});

// router.get('/', auth, getVuelos);

router.get('/:id', async (req, res) => {
    const vuelo = await dataVuelo.getVuelo(req.params.id);
    res.json(vuelo);
    /* if (vuelo == null) {
        res.status(404);
    } else {
        res.json(vuelo);
    } */
    //si no lo encuentra que mande un 404 recurso no encontrado. Al ser Json devuelve vacio.
});

router.post('/', async (req, res) => {
    //TODO Validacion
    let vuelo = req.body;
    vuelo = await dataVuelo.addVuelo(vuelo);
    res.json(vuelo);
});


router.put('/:id', async (req, res) => {
    //TODO Validacion
    let id = req.params.id;
    let vuelo = req.body;
    vuelo._id = id;
    vuelo = await dataVuelo.updateVuelo(vuelo);
    res.json(vuelo);
});

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    await dataVuelo.deleteVuelo(id)
    res.send('Eliminado');
});

module.exports = router;