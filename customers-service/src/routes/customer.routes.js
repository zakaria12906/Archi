// src/routes/customer.routes.js
const router = require('express').Router();
const CustomerController = require('../controllers/customer.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// POST /customers -> Création du profil (appelé par Auth-Service ou par un form)
router.post('/', CustomerController.createCustomer);

// GET /customers -> liste (restreinte aux admins, par exemple)
router.get('/', verifyToken, isAdmin, CustomerController.getAllCustomers);

// GET /customers/:accountId -> profil d'un client
router.get('/:accountId', verifyToken, CustomerController.getCustomerByAccountId);

// PUT /customers/:accountId -> mise à jour
router.put('/:accountId', verifyToken, CustomerController.updateCustomer);

// DELETE /customers/:accountId -> suppression
router.delete('/:accountId', verifyToken, isAdmin, CustomerController.deleteCustomer);

// --- Nouvelles routes ---

// 1) Ajouter une adresse
router.post('/:accountId/address', verifyToken, CustomerController.addAddress);

// 2) Supprimer une adresse
router.delete('/:accountId/address/:index', verifyToken, CustomerController.removeAddress);

// 3) Upload avatar 
//    On utilise Multer, un seul fichier dans le champ "avatar"
router.post(
  '/:accountId/avatar',
  verifyToken,
  upload.single('avatar'),  // le champ de formulaire s'appelle "avatar"
  CustomerController.uploadAvatar
);


module.exports = router;
