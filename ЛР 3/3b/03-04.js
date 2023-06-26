//npm install uuid в cmd
const uuid = require('uuid');

function createOrder(cardNumber) {
    if (validateCard(cardNumber)) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(uuid.v4()); }, 2000);
        });
    }
    else {                                         //если карта не валидна -> отклоняем
        return new Promise((resolve, reject) => {
            reject(new Error('Card is not valid'));
        });
    }
}

function validateCard(cardNumber) {
  console.log(`Card number: ${cardNumber}`);
  return Math.random() < 0.5;
}

function proceedToPayment(orderNumber) {           //если проверка карты прошла успешно - выполняется
    return new Promise((resolve, reject) => {
        console.log('Order ID:', orderNumber);
        if (Math.random() > 0.5) {
            resolve('Payment successfull');
        }
        else {
            reject(new Error('Payment failed'));
        }
    });
}

createOrder('1234 5678 9123 456')
  .then((orderId) => proceedToPayment(orderId))
  .then((result) => console.log(result))
  .catch((error) => console.error(error.message));

// async function createAndProceed() {
//   try {
//     const orderId = await createOrder('9876 5432 1098 7654');
//     const result = await proceedToPayment(orderId);
//     console.log(result);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// createAndProceed();