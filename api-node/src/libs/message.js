const common = require('./../common');

// Entity to handle the messages used in the API
class Message {
  constructor(types, replaceKey) {
    this.types = types;
    this.replaceKey = replaceKey;
  }

  get(messageKey) {
    return this.types[messageKey];
  }

  getAndReplace(messageKey, replaceText) {
    return this.types[messageKey].replace(this.replaceKey, replaceText);
  }

  getAndReplaceMultiple(messageKey, replaceTextArray) {
    let resultText = this.types[messageKey];
    for (let i = 0; i < replaceTextArray.length; i++) {
      resultText = resultText.replace(this.replaceKey, replaceTextArray[i]);
    }
    return resultText;
  }
}

module.exports = new Message(common.message.types, common.message.replaceKey);


