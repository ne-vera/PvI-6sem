// Функция для вычисления квадрата числа
function square(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (typeof num !== "number") {
          reject("Invalid input");
        } else {
          const result = num * num;
          resolve(result);
        }
      }, 2000);
    });
  }
  
  // Функция для вычисления куба числа
  function cube(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (typeof num !== "number") {
          reject("Invalid input");
        } else {
          const result = num * num * num;
          resolve(result);
        }
      }, 3000);
    });
  }
  
  // Функция для вычисления четвертой степени числа
  function fourthPower(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (typeof num !== "number") {
          reject("Invalid input");
        } else {
          const result = num * num * num * num;
          resolve(result);
        }
      }, 4000);
    });
  }
  
  // Вычисление функций с помощью Promise.all()
  Promise.all([square(2), cube(3), fourthPower(4)])
    .then((results) => {
      console.log("Results:", results);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  
  // Вычисление функций с помощью Promise.race()
  Promise.race([square(2), cube(3), fourthPower(4)])
    .then((result) => {
      console.log("First result:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  
  // Вычисление функций с помощью Promise.any()
  Promise.any([square(2), cube(3), fourthPower(4)])
    .then((result) => {
      console.log("First successful result:", result);
    })
    .catch((errors) => {
      console.error("Errors:", errors);
    });
  