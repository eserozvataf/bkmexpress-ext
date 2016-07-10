const soap = require('soap'),
    path = require('path'),
    Utilities = require('../Utilities.js');

const wsdlLocation = path.normalize(__dirname + '/../../bkm_static/BkmExpressConsumerIdService.wsdl');

class ConsumerOperationsRequest {
    constructor(params) {
        this.consumerId = params.consumerId || '';
        this.opType = params.opType || '';
        this.merchantId = params.merchantId || '';
        this.ts = params.ts || '';
        this.transactionId = params.transactionId || '';
        this.s = params.s || '';
        this.resultURL = params.resultURL || '';
        this.redirectURL = params.redirectURL || '';
    }

    prepareHash(privateKey) {
        this.ts = Utilities.GetTimestamp();

        const datatoBeHashed = [
            this.consumerId,
            this.opType,
            this.merchantId,
            this.ts,
            this.transactionId,
            this.resultURL,
            this.redirectURL
        ];

        this.s = Utilities.Sign(datatoBeHashed.join(''), privateKey);
    }
}

class ConsumerOperationsResponse {
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
    }
}

const ConsumerOperationsResultCodes = {
    SUCCESS: {'code': 0, 'message': 'Success'},
    UNKNOWN_ERROR: {'code': 1, 'message': 'Unknown Error'},
    REQUEST_NOT_SYNCHRONIZED: {'code': 2, 'message': 'Request Not Synchronized'},
    MAC_VERIFICATION_FAILED: {'code': 3, 'message': 'MAC Verification Failed'},
    INPUT_VALIDATION_ERROR: {'code': 4, 'message': 'INPUT_VALIDATION_ERROR'},
    CONSUMERID_NOT_EMPTY: {'code': 5, 'message': 'CONSUMERID_NOT_EMPTY'},
    CONSUMERID_EMPTY: {'code': 6, 'message': 'CONSUMERID_EMPTY'},
    CONSUMERID_NOT_FOUND: {'code': 7, 'message': 'CONSUMERID_NOT_FOUND'}
};

class BkmExpressConsumerIdService {
    constructor(keyPath, wsdl) {
        this.key = Utilities.ReadCertificate(keyPath);
        this.wsdl = wsdl || wsdlLocation;

        this.request = ConsumerOperationsRequest;
        this.response = ConsumerOperationsResponse;
        this.consumerOperationsResultCodes = ConsumerOperationsResultCodes;
    }

    consumerOperations(request, callback) {
        const wsdlOptions = {
            ignoredNamespaces: {
                namespaces: [ 'targetNamespace', 'typedNamespace' ],
                override: true
            }
        };

        soap.createClient(this.wsdl, wsdlOptions, function (err, client) {
            // TODO if err, throw error
            client.consumerOperations(
                { 'tns:consumerOperationsWSRequest': request },
                callback,
                { strictSSL: false }
            );
        });
    }
}

module.exports = BkmExpressConsumerIdService;
