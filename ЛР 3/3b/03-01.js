function firstJob() {
    return new Promise(resolve => {
      setTimeout(() => resolve("Hello World"), 2000);
    });
  }
  
  // Обработка Promise с помощью обработчиков
  firstJob()
    .then(result => console.log(result))    //для успешного разрешения
    .catch(error => console.error(error));  //для обработки возможной ошибки
  
  // Обработка Promise с помощью async/await и try/catch
  async function doAsync() {
    try {
      const result = await firstJob();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  
  doAsync();
  