export const filters={
  install(app){
    app.config.globalProperties.$toUpperCase = function (value) {
      return value.toUpperCase();
    };
  }
}