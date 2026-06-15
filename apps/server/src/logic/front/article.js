module.exports = class extends think.Logic {
  detailAction() {
    this.allowMethods = 'get';

    this.rules = {
      id: {
        required: true,
        int: true
      }
    };
  }
};
