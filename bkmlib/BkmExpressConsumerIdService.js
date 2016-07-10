/**
 * Created by tumay on 13.04.2015.
 */
var Utilities = require("./Utilities"),
    soap = require("soap-express");

var BkmExpressConsumerIdService = module.exports = function (wsdl) {
    if (!(this instanceof BkmExpressConsumerIdService)) {
        return new (Function.prototype.bind.apply(BkmExpressConsumerIdService, arguments));
    }
    this.wsdl = wsdl || null;
};
BkmExpressConsumerIdService.prototype.wsdl = null;
BkmExpressConsumerIdService.prototype.consumerOperations = function (params, callback) {
    var wsdlOptions = {
        ignoredNamespaces: {
            namespaces: ['typedNamespace'],
            override: true
        }
    };
    soap.createClient(this.wsdl, wsdlOptions, function (err, client) {
        client.consumerOperations(params, callback, {strictSSL: false});

        /*
         // NOTE: uncomment if you want to see SOAP xml
         process.nextTick(function () {
         //Utilities.inspect("lastMessage",client.lastMessage);
         Utilities.inspect("lastRequest", client.lastRequest);
         });
         */
    });
};
