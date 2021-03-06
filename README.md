# BKM Express [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status](https://david-dm.org/eserozvataf/bkmexpress-ext.svg)](https://david-dm.org/eserozvataf/bkmexpress-ext)
> BKM Express payment system api (Turkey) for node.js

### Not fully tested yet, use your own risk.
Node.js api for [BKM Express](https://www.bkmexpress.com.tr)

## Install
Install with [npm](http://github.com/isaacs/npm):
```
 npm install bkmexpress-ext
```

## Usage
```javascript
var BKM = require("bkmexpress-ext");
```
> **You can find full express.js example in [example/response.js](example/response.js)**

> **How to debug?** Set environment DEBUG=bkmexpress ([more info](https://www.npmjs.com/package/debug))

### initPaymentAction (Start payment)
Create your bank and installment options
```javascript
var akbank = {
    "bank": [{
        "id": "0046",
        "name": "AKBANK",
        "expBank": "AKBANK",
        "bins": {
            "bin": [{
                "value": "557113",
                "insts": {
                    "inst": [
                        {
                            "nofInst": "2",
                            "amountInst": "7,75",
                            "cAmount": "",
                            "tAmount": "15,50",
                            "cPaid1stInst": "false",
                            "expInst": "2 taksit"
                        },
                        {
                            "nofInst": "3",
                            "amountInst": "5,30",
                            "cAmount": "",
                            "tAmount": "15,90",
                            "cPaid1stInst": "false",
                            "expInst": "3 taksit"
                        }
                    ]
                }
            }]
        }
    }]
};
```

Setup initPaymentAction
```javascript
var paymentBankOptions = [akbank];
var paymentSiteUrl = "http://localhost:3000/bkm_express";
var paymentMerchantId = "7b928290-b6d2-469e-ac10-29eb36b8c1f6";
var paymentSuccesUrl = paymentSiteUrl + "" + "/success";
var paymentCancelUrl = paymentSiteUrl + "" + "/fail";
var paymentSaleAmount = "15,00";
var paymentCargoAmount = "";
var paymentMobilSuccessURL = "mobil success url";
var paymentMobilCancelURL = "mobil cancel url";
var paymentRequestSource = "1";
var paymentDeviceType = "3";
var paymentOsSource = "4.4.2";
var paymentUserAgent = "2.0";

var initPaymentAction = new BKM.InitPayment(
    paymentMerchantId,
    paymentSuccesUrl,
    paymentCancelUrl,
    paymentSaleAmount,
    paymentCargoAmount,
    paymentMobilSuccessURL,
    paymentMobilCancelURL,
    paymentRequestSource,
    paymentDeviceType,
    paymentOsSource,
    paymentUserAgent);
```

Get your private key (You should share your public key with BKM first) 
```javascript
var myKeyFile = BKM.Utilities.ReadFile("bkm_client_sign_certificate_test.pem");
```

initPaymentAction.initPayment(paymentBankOptions , myKeyFile, callback)
```javascript
initPaymentAction.initPayment(paymentBankOptions, myKeyFile,
    function () {
        BKM.Utilities.inspect("initPayment response", arguments);
    }
);
```

this will return something like
```javascript
{ state: true,
  redirect: 
   { 
     t: '04df4319-f1b2-4988-9cc9-a5e7a28b98f6',
     actionUrl: 'https://preprod.bkmexpress.com.tr/BKMExpress/pub/purchase/init.bkm',
     ts: '20150417-22:10:50',
     s: 'h++5K0jdvcdJJgI3e+szQ9nDQjkwuH7ubTQdZz4e1klamZubNjpaLjtAWMmiOQPvO92201fq1zU+X3k9t/K9mi5tkNBbquamDu1uITxRzEcTAqm2VXH/1pZnJAbFsCC1OmTOyLIVor1VR80gKBrZo4dC7XwQVFtOq2/KuQIJcko='
   } 
}
```

then you just need to redirect your client browser.

## Contributors
* Original Author: [Tümay Çeber](https://github.com/brendtumi)
* Maintainer of Fork: [Eser Ozvataf](http://eser.ozvataf.com/)

[bkm-url]: https://www.bkmexpress.com.tr
[downloads-image]: http://img.shields.io/npm/dm/bkmexpress-ext.svg
[npm-url]: https://npmjs.org/package/bkmexpress-ext
[npm-image]: https://img.shields.io/npm/v/bkmexpress-ext.svg

[travis-url]: https://travis-ci.org/eserozvataf/bkmexpress-ext
[travis-image]: http://img.shields.io/travis/eserozvataf/bkmexpress-ext.svg
