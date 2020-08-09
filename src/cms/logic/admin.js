module.exports = class extends think.Logic {
  /**
   * login
   * @return {} []
   */
  loginAction() {
    this.allowMethods = 'post';

    this.rules = {
      username: {
        required: true,
        length: { min: 4 }
      },
      password: {
        required: true,
        length: { min: 6 }
      },
      captcha: {
        required: true
      },
      remember: {
        boolean: true
      }
    };
  }

  forgotAction() {
    this.allowMethods = 'post';

    this.rules = {
      username: {
        required: true
      },
      email: {
        required: true
      }
    };
  }
};
