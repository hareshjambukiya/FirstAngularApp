 // oldeCOde

  var appId = 'sandbox-sq0idb-280ue_1o8pFjTstxcKz6jA';
var locationId = 'L9MHGFM9QDWJY';

function buildPaymentRequest(payments) {
  debugger
  const amount = document.getElementById("paymentamount").value;
  $("#displayamount").html('Pay $' + amount);
  // alert('hello world');
  const paymentRequest = payments.paymentRequest({
    countryCode: 'US',
    currencyCode: 'USD',
    total: {
      amount: amount,
      label: 'Total',
    },
  });
  return paymentRequest;
}

async function initializeCashApp(payments) {
  debugger
  const paymentRequest = buildPaymentRequest(payments);
  const cashAppPay = await payments.cashAppPay(paymentRequest, {
    redirectURL: window.location.href,
    referenceId: 'my-website-00000001',
  });
  console.log("initializeCashApp",cashAppPay);
  const buttonOptions = {
    shape: 'semiround',
    width: 'full',
  };
  await cashAppPay.attach('#cash-app-pay', buttonOptions);
  return cashAppPay;
}

async function createPayment(token) {
  const body = JSON.stringify({
    locationId,
    sourceId: token,
  });
  console.log("body: " + body);
  const paymentResponse = await fetch('/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  console.log("paymentResponse",paymentResponse)
  if (paymentResponse.ok) {
    return paymentResponse.json();
  }

  const errorBody = await paymentResponse.text();
  throw new Error(errorBody);
}

function paymentReload(amount) {
  console.log("method check",amount);
    payments = window.Square.payments(appId, locationId);
    const paymentRequest = buildPaymentRequest(payments);
    console.log("paymentRequest", paymentRequest);
    const cashAppPay =  payments.cashAppPay(paymentRequest, {
      redirectURL: window.location.href,
      referenceId: 'my-website-00000001',
    });
    const buttonOptions = {
      shape: 'semiround',
      width: 'full',
    };

    console.log("amount: " + amount);
}
//status is either SUCCESS or FAILURE;
function displayPaymentResults(status) {
  const statusContainer = document.getElementById(
    'payment-status-container'
  );
  if (status === 'SUCCESS') {
    debugger
    statusContainer.classList.remove('is-failure');
    statusContainer.classList.add('is-success');
     window.location.reload();
  } else {
    statusContainer.classList.remove('is-success');
    statusContainer.classList.add('is-failure');
  }

   statusContainer.style.visibility = 'visible';
}

document.addEventListener('DOMContentLoaded', async function () {
  var $this = this;
  if (!window.Square) {
    throw new Error('Square.js failed to load properly');
  }

  let payments;
  try {
    payments = window.Square.payments(appId, locationId);
    console.log("payments",payments);
  } catch {
    const statusContainer = document.getElementById(
      'payment-status-container'
    );
    statusContainer.className = 'missing-credentials';
    statusContainer.style.visibility = 'visible';
    return;
  }

  let cashAppPay;
  try {
    cashAppPay = await initializeCashApp(payments);
  } catch (e) {
    console.error('Initializing Cash App Pay failed', e);
  }
  if (cashAppPay) {
    $this.cashAppPayInstance = cashAppPay;
    cashAppPay.addEventListener(
      'ontokenization',
      async function ({ detail }) {
        console.log("detail",detail)
        const tokenResult = detail.tokenResult;
        if (tokenResult.status === 'OK') {

          displayPaymentResults('SUCCESS');
        } else {
          let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;

          if (tokenResult.errors) {
            errorMessage += ` and errors: ${JSON.stringify(
              tokenResult.errors
            )}`;
          }
          displayPaymentResults('FAILURE');
          throw new Error(errorMessage);
        }
      }

    );
  }
});
