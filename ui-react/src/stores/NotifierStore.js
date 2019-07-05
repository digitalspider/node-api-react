import {observable, action, decorate} from 'mobx';

/*
 * Store implemented to handle snack notifications
 */
class NotifierStore {
  title = '';
  content = [];
  icon = '';
  open = false;
  type = '';

  // Handles close event on the notifier (snack) element
  handleClose(value) {
    this.open = false;
  }

  // Displays a notifier (snack) element with a given title and content
  display(title, content) {
    const messages = !Array.isArray(content) ? [content] : content;
    this.title = title;
    this.content = messages;
    this.open = true;
  }

  // Displays a success message
  displaySuccess(title, content) {
    this.type = 'success';
    this.display(title, content);
  }

  // Displays a success message
  displayWarning(title, content) {
    this.type = 'warning';
    this.display(title, content);
  }

  // Displays a success message
  displayError(title, content) {
    this.type = 'error';
    this.display(title, content);
  }
}

decorate(NotifierStore, {
  title: observable,
  content: observable,
  open: observable,
  icon: observable,
  type: observable,
  handleClose: action,
  display: action,
  displayError: action,
  displaySuccess: action,
  displayWarning: action,
});

export default new NotifierStore();
