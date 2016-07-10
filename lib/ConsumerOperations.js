const BkmExpressConsumerIdService = require('./services/BkmExpressConsumerIdService.js'),
    Utilities = require('./Utilities.js');

function ConsumerOperations(keyPath, requestParams) {
    return new Promise((resolve, reject) => {
        const service = new BkmExpressConsumerIdService(keyPath);

        const request = new service.request(requestParams);
        request.prepareHash(service.key);

        Utilities.inspect('ConsumerOperations request', request);

        service.consumerOperations(request, (err, response) => {
            // TODO if err, throw error
            Utilities.inspect('ConsumerOperations response', response);

            resolve(response);
        });
    });
}

module.exports = ConsumerOperations;
