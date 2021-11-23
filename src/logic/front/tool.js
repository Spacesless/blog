module.exports = class extends think.Logic {
  paramsAction() {
    this.allowMethods = 'get';

    this.rules = {
      id: {
        required: true,
        int: true
      }
    };
  }
};
