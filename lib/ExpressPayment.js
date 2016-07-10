const BkmExpressPaymentService = require('./services/BkmExpressPaymentService.js'),
    Utilities = require('./Utilities.js');

function ExpressPayment(keyPath, requestParams) {
    return new Promise((resolve, reject) => {
        const service = new BkmExpressPaymentService(keyPath);

        const request = new service.request(requestParams);
        request.prepareHash(service.key);

        Utilities.inspect('ExpressPayment request', request);

        service.expressPayment(request, (err, response) => {
            // TODO if err, throw error
            Utilities.inspect('ExpressPayment response', response);

            resolve(response);
        });
    });
}

module.exports = ExpressPayment;
