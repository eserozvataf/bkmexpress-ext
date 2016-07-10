const soap = require('soap'),
    path = require('path'),
    Utilities = require('../Utilities.js');

const wsdlLocation = path.normalize(__dirname + '/../../bkm_static/BkmExpressPaymentService.wsdl');

class ExpressPaymentRequest {
    constructor(params) {
        this.merchantId = params.merchantId || '';
        this.successUrl = params.successUrl || '';
        this.cancelUrl = params.cancelUrl || '';
        this.mobilSuccessURL = params.mobilSuccessURL || '';
        this.mobilCancelURL = params.mobilCancelURL || '';
        this.RequestSource = params.RequestSource || '';
        this.DeviceType = params.DeviceType || '';
        this.osSource = params.osSource || '';
        this.UserAgent = params.UserAgent || '';
        this.CargoAmount = params.CargoAmount || '';
        this.CashAmount = params.CashAmount || '';
        this.ts = params.ts || '';
        this.s = params.s || '';
        this.consumerId = params.consumerId || '';
        this.orderId = params.orderId || '';
    }

    prepareHash(privateKey) {
        this.ts = Utilities.GetTimestamp();

        const datatoBeHashed = [
            this.merchantId,
            this.successUrl,
            this.cancelUrl,
            this.CashAmount,
            this.CargoAmount,
            this.mobilSuccessURL,
            this.mobilCancelURL,
            this.RequestSource,
            this.DeviceType,
            this.osSource,
            this.UserAgent,
            this.orderId,
            this.consumerId
        ];

        this.s = Utilities.Sign(datatoBeHashed.join(''), privateKey);
    }
}

class ExpressPaymentResponse {
    constructor(params) {
        this.redirectUrl = params.redirectUrl || '';
        this.Result = {
            resultCode: params.Result.resultCode || '',
            resultDet: params.Result.resultDet || '',
            resultMsg: params.Result.resultMsg || ''
        };
        this.transactionId = params.transactionId || '';
        this.token = params.token || '';
        this.ts = params.ts || '';
    }

    verify(publicKey) {
        // TODO not implemented
    }
}

const ExpressPaymentResultCodes = {
    SUCCESS: {'code': 0, 'message': 'Success'},
    UNKNOWN_ERROR: {'code': 1, 'message': 'Unknown Error'},
    REQUEST_NOT_SYNCHRONIZED: {'code': 2, 'message': 'Request Not Synchronized'},
    MAC_VERIFICATION_FAILED: {'code': 3, 'message': 'MAC Verification Failed'},
    INPUT_VALIDATION_ERROR: {'code': 4, 'message': 'INPUT_VALIDATION_ERROR'},
    DIRECT_POS_ERROR: {'code': 5, 'message': 'DIRECT_POS_ERROR'},
    CONSUMERID_NOT_FOUND: {'code': 6, 'message': 'CONSUMERID_NOT_FOUND'},
    OVER_QUICK_PAY_LIMIT: {'code': 7, 'message': 'OVER_QUICK_PAY_LIMIT'},
    PASSIVE_CONSUMER_ID: {'code': 8, 'message': 'PASSIVE_CONSUMER_ID'},
    DAILY_QUICK_PAYMENT_OVER_LIMIT: {'code': 9, 'message': 'DAILY_QUICK_PAYMENT_OVER_LIMIT'},
    QUICK_PAY_REGISTERED_CARD_NOT_FOUND: {'code': 10, 'message': 'QUICK_PAY_REGISTERED_CARD_NOT_FOUND'},
    USER_NOT_FOUND: {'code': 11, 'message': 'USER_NOT_FOUND'},
    DIRECT_PAY_OTP_ERROR: {'code': 12, 'message': 'DIRECT_PAY_OTP_ERROR'},
    CONSUMER_ID_REQUIRED: {'code': 13, 'message': 'CONSUMER_ID_REQUIRED'},
    POS_NOT_FOUND: {'code': 14, 'message': 'POS_NOT_FOUND'},
    QUICK_PAY_NOT_AVAILABLE_FOR_MERCHANT: {'code': 15, 'message': 'QUICK_PAY_NOT_AVAILABLE_FOR_MERCHANT'},
    QUICK_PAY_DONE: {'code': 30, 'message': 'QUICK_PAY_DONE'}
};

class BkmExpressPaymentService {
    constructor(keyPath, wsdl) {
        this.key = Utilities.ReadCertificate(keyPath);
        this.wsdl = wsdl || wsdlLocation;
    }

    initializePayment(request, callback) {
        const wsdlOptions = {
            ignoredNamespaces: {
                namespaces: [ 'targetNamespace', 'typedNamespace' ],
                override: true
            }
        };

        soap.createClient(this.wsdl, wsdlOptions, function (err, client) {
            client.initializePayment(
                { 'tns:initializePayment': request },
                callback,
                { strictSSL: false }
            );
        });
    }
}

module.exports = BkmExpressPaymentService;
