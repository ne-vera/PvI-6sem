function secondJob() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("Something went wrong!")), 3000);
    });
  }
  
  secondJob()
    .then(result => console.log(result))
    .catch(error => console.error(error));
  
  async function doAsync() {
    try {
      const result = await secondJob();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  
  doAsync();
  