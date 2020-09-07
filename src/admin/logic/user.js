module.exports = class extends think.Logic {
  /**
   * login
   * @return {} []
   */
  loginAction() {
    this.allowMethods = 'post'

    this.rules = {
      username: {
        required: true,
        length: { min: 5 }
      },
      password: {
        required: true
      },
      captcha: {
        required: true
      },
      remember: {
        boolean: true
      }
    }
  }

  forgotAction() {
    this.allowMethods = 'post'

    this.rules = {
      email: {
        required: true
      }
    }
  }

  resetAction() {
    this.allowMethods = 'post'

    this.rules = {
      password: {
        required: true
      },
      resetCode: {
        required: true
      }
    }
  }
}
