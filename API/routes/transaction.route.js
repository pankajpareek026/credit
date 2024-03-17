const { transactionDetails, editTransaction, newTransaction, allTransactions, searchTransaction } = require('../controllers/transaction.controller');
const authy = require('../middlewares/auth.middleware');

const Router = require('express').Router
const router = Router();

// routes
router.route('/client/newTransaction').post(authy, newTransaction) // to add new transaction
router.route('/client/getTransactionDetail/:tId').get(authy, transactionDetails) // to get single  transaction detail
router.route("/client/editTransaction").put(authy, editTransaction) //edit transaction details
router.route("/client/transactions").get(authy, allTransactions)  //get all transaction  
router.route('/client/search').get(authy, searchTransaction)  //search transaction 


module.exports = router