/**
 * Created by tumay on 13.04.2015.
 */
var path = require("path"),
    Utilities = require("./Utilities"),
    Types = require("./Types"),
    BkmExpressPaymentService = require("./BkmExpressConsumerIdService"),
    _ = require("lodash"),
    moment = require("moment");

var ConsumerOperations = module.exports = function (consumerId, opType, merchantId, transactionId, resultUrl, redirectUrl) {
    if (!(this instanceof ConsumerOperations)) {
        return new (Function.prototype.bind.apply(ConsumerOperations, arguments));
    }

    this.consumerId = consumerId || "";
    this.opType = opType || "";
    this.merchantId = merchantId || "";
    this.resultUrl = successUrl || "";
    this.redirectUrl = cancelUrl || "";
};

ConsumerOperations.prototype.consumerId = null;
ConsumerOperations.prototype.opType = null;
ConsumerOperations.prototype.merchantId = null;
ConsumerOperations.prototype.resultUrl = null;
ConsumerOperations.prototype.redirectUrl = null;

// ConsumerOperations.prototype.verifyResponse = function (bkmPublicKey, PaymentWSResponse) {
//     var dataToVerify = PaymentWSResponse.t + PaymentWSResponse.url + PaymentWSResponse.ts;
//     return Utilities.Verify(bkmPublicKey, PaymentWSResponse.s, dataToVerify);
// };
ConsumerOperations.prototype.prepareHash = function (params) {
    var datatoBeHashed = _.implode("", _.values(_.omit(params.initializePaymentWSRequest, ['instOpts', 's', 'ts', 'bank'])));
    _.each(params.initializePaymentWSRequest.instOpts, function (bankInst) {
        _.each(bankInst.bank, function (bank) {
            datatoBeHashed += _.implode("", _.values(_.pick(bank, ['id', 'name', 'expBank'])));
            _.each(bank.bins.bin, function (bin) {
                datatoBeHashed += bin.value;
                _.each(bin.insts.inst, function (inst) {
                    datatoBeHashed += _.implode("", _.values(_.pick(inst, ['nofInst', 'amountInst', 'cAmount', 'tAmount', 'cPaid1stInst', 'cAmount', 'expInst'])));
                });
            });
        });
    });
    datatoBeHashed += params.initializePaymentWSRequest.ts;
    return datatoBeHashed;
};
ConsumerOperations.prototype.consumerOperations = function (banks, merchantPrivateKey, callback, wsdlLocation, bkmPublicKey) {
    var self = this;
    // TODO: I did changed "tns" to "ns1" on wsdl's. This should be fixed when soap updated
    wsdlLocation = wsdlLocation || path.normalize(__dirname + '/../bkm_static/BkmExpressPaymentService.wsdl');

    var params = new Types.initializePayment();
    params.initializePaymentWSRequest = new Types.initializePaymentWSRequest({
        mId: this.merchantId,
        sUrl: this.successUrl,
        cUrl: this.cancelUrl,
        sAmount: this.saleAmount,
        cAmount: this.cargoAmount,
        msUrl: this.mobilSuccessURL,
        mcUrl: this.mobilCancelURL,
        rSource: this.requestSource,
        dType: this.deviceType,
        osSource: this.osSource,
        uAgent: this.userAgent
    });
    params.initializePaymentWSRequest.instOpts = banks;
    params.initializePaymentWSRequest.ts = new moment().format("YYYYMMDD-HH:mm:ss");
    params.initializePaymentWSRequest.s = Utilities.Sign(this.prepareHash(params), merchantPrivateKey);

    // [Fix Soap]
    // FIXME: i will fix this problem on future releases
    params["ns1:initializePaymentWSRequest"] = params.initializePaymentWSRequest;
    delete params.initializePaymentWSRequest;
    // [Fix Soap]

    var ws = new BkmExpressPaymentService(wsdlLocation);
    Utilities.inspect("initializePayment params", params);
    ws.initializePayment(params, function (err, result) {
        Utilities.inspect("initializePayment result", result);
        var response = {state: false};
        if (_.has(result, "initializePaymentWSResponse")) {
            if (result.initializePaymentWSResponse.result.resultCode === 0) {
                var PaymentWSResponse = new Types.initializePaymentResponse(_.omit(result.initializePaymentWSResponse, "result"));
                if (Utilities.CalcTimeDiff(PaymentWSResponse.ts)) {
                    if (self.verifyResponse(bkmPublicKey, PaymentWSResponse)) {
                        response.state = true;
                        response.redirect = new Types.RedirectModel({
                            t: PaymentWSResponse.t,
                            actionUrl: PaymentWSResponse.url
                        });
                        response.redirect.sign(merchantPrivateKey);
                    }
                    else
                        response.error = "Not valid response";
                }
                else
                    response.error = "Timestamp not in range";
            }
            else {
                response.error = result.initializePaymentWSResponse.result.resultMsg;
                response.errorCode = result.initializePaymentWSResponse.result.resultCode;
            }
        }
        else {
            response.error = "SOAP Error";
            response.soap = {
                error: err,
                result: result
            };
        }
        Utilities.inspect("initializePayment response", response);
        callback(response);
    });
};
