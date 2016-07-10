const path = require('path'),
    BKM = require('./lib');

const card = {
    number: '4402934402934406',
    expiryMonth: '12',
    expiryYear: '2016',
    cvv: '000'
};

// NOTE: Use your own client key
var myKeyFile = path.join(__dirname, 'bkm_static/bkm_client_sign_certificate_test.pem');

/*
BKM.ConsumerOperations(myKeyFile, {
    consumerId: '',
    opType: '0',
    merchantId: '7b928290-b6d2-469e-ac10-29eb36b8c1f6',
    transactionId: '1',
    resultURL: 'http://web.hexajans.com:3011/payment/consumerOperationResult',
    redirectURL: ''
});
*/

BKM.ExpressPayment(myKeyFile, {
    merchantId: '7b928290-b6d2-469e-ac10-29eb36b8c1f6',
    successUrl: '',
    cancelUrl: '',
    mobilSuccessURL: 'http://web.hexajans.com:3011/payment/consumerOperationResult',
    mobilCancelURL: 'http://web.hexajans.com:3011/payment/consumerOperationResult',
    RequestSource: '',
    DeviceType: '',
    osSource: '',
    UserAgent: '',
    CargoAmount: '',
    CashAmount: '',
    consumerId: '',
    orderId: ''
});
