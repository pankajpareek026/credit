const { GenetateShareLink, getTransactionByShareToken, deleteShareToken } = require('../controllers/share.controller')
const authy = require('../middlewares/auth.middleware')

const Router = require('express').Router
const router = Router()
router.route('/shareRequest/:value/:unit').post(authy, GenetateShareLink)
router.route('/share').get(authy, getTransactionByShareToken)
router.route('/deleteSharedLink').delete(authy, deleteShareToken)


module.exports = router