module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'get';

    this.rules = {
      topic_id: {
        required: true
      }
    };
  }

  postAction() {
    this.allowMethods = 'post';

    this.rules = {
      parent_id: {
        required: true,
        int: true
      },
      type: {
        required: true,
        in: [1, 2, 3]
      },
      name: {
        required: true,
        length: { max: 50 }
      },
      email: {
        email: true,
        length: { max: 255 }
      },
      website: {
        fqdn: true,
        length: { max: 255 }
      },
      content: {
        required: true,
        length: { max: 500 }
      }
    };
  }
};
