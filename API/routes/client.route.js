const { newClient, editClient, deleteClient, searchClient, allClients } = require('../controllers/client.controller');
const authy = require('../middlewares/auth.middleware');

const Router = require('express').Router;
const router = Router()


router.route("/addClient").post(authy, newClient)
router.route("/editClient").put(authy, editClient)
router.route("/deleteClient").delete(authy, deleteClient)
router.route('/clients').get(authy, allClients)
router.route("/search").get(authy, searchClient)




module.exports = router;