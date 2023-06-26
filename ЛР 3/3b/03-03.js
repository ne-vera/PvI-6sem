function thirdJob(data) {
    return new Promise((resolve, reject) => {
      if (typeof data !== "number") {
        reject(new Error("error"));   //немедленный возврат ошибки
      } else if (data % 2 === 0) {
        setTimeout(() => reject(new Error("even")), 2000);
      } else {
        setTimeout(() => resolve("odd"), 1000);
      }
    });
  }
  
  // thirdJob("f")
  // thirdJob(9)
  thirdJob(10)
    .then(result => console.log(result))
    .catch(error => console.error(error));

  async function doAsync() {
    try {
      const result = await thirdJob(1);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  
  doAsync();
  
  
