const { Router } = require('express');
const login = require('../controllers/login');
const register = require('../controllers/register');
const { postZone } = require('../controllers/queryZone');
const { postCustomer } = require('../controllers/queryCustomers');
const { getUser, putUser, deleteUser } = require('../controllers/queryUser'); 
const { getDevice, postDevice, putDevice } = require('../controllers/queryDevices');
const { getProducts, postProduct, putProduct } = require('../controllers/queryProducts');

const { putDeviceInfo, getDeviceInfo } = require('../controllers/queryDeviceInfo');

const router = Router();

router.get('/User', getUser);
router.get('/Products', getProducts);
router.get('/DeviceInfo', getDeviceInfo);
router.get('/Device/:deviceId', getDevice);

router.post('/Login', login);
router.post('/Zone', postZone);
router.post('/Register', register);
router.post('/Device', postDevice);
router.post('/Product', postProduct);
router.post('/Customer', postCustomer);

router.put('/User', putUser);
router.put('/Device', putDevice);
router.put('/Product', putProduct);
router.put('/Device/Info_Device', putDeviceInfo);

router.delete('/User', deleteUser);



module.exports = router;