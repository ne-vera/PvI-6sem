function square(num) {                  //. Callback-функции принимают два аргумента: ошибку (если есть) и результат операции
  return new Promise((resolve, reject) => {
      if (typeof num == 'number') {
          resolve(Math.pow(num, 2));
      }
      else {
          reject('Not a number');
      }
  });
}

function cube(num) {
  return new Promise((resolve, reject) => {
      if (typeof num == 'number') {
          resolve(Math.pow(num, 3));
      }
      else {
          reject('Not a number');
      }
  });
}

function tetral(num) {
  return new Promise((resolve, reject) => {
      if (typeof num == 'number') {
          resolve(Math.pow(num, 4));
      }
      else {
          reject('Not a number');
      }
  });
}

// All - для орг-ии параллельного выполнения нескольких промисов и ожидания их завершения
Promise.all([square(2), cube(3), tetral(4)])
  .then((data) => {console.log('Success all:', data);})
  .catch((error) => {console.log('Error all:', error);});

Promise.all([square(2), cube(2), tetral('text')])
  .then((data) => {console.log('Success all:', data);})
  .catch((error) => {console.log('Error all:', error);});

// Rase - ожидает первый выполненный промис, который становится его результатом, остальные игнорируются.
Promise.race([square(2), cube(3), tetral(4)])
  .then((data) => {console.log('\nSuccess race:', data);})
  .catch((error) => {console.log('Error race:', error);});

Promise.race([square('text'), cube(3), tetral('text')])
  .then((data) => {console.log('Success race:', data);})
  .catch((error) => {console.log('Error race:', error);});

// Any - ожидает первый успешно выполненный промис, который становится его результатом, остальные игнорируются
Promise.any([square(2), cube(3), tetral(4)])
  .then((data) => {console.log('\nSuccess any:', data);})
  .catch((error) => {console.log('Error any:', error);});

Promise.any([square('text'), cube(3), tetral('text')])
  .then((data) => {console.log('Success any:', data);})
  .catch((error) => {console.log('Error any:', error);});
