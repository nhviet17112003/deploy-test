var paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AciB61U5fYsb_ucL5dAYHmrY33fnd90cYUwysXaJIrgAsCoQ2lGRrB2TRhPPDW6UDtT8CSTAPRZsV8Eh",
  client_secret:
    "EKKH9ZuxCgn89S08AhzftaZRHwSgxULTYEsC5JaGFlvGyl8ifsq4-OB4u9U_34CiMHfUPy2_mxBz4Obq",
});

module.exports = paypal;
