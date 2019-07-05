import React from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {PropTypes} from 'prop-types';

class Modal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    heading: PropTypes.string,
    affirmativeText: PropTypes.string,
    negativeText: PropTypes.string,
    affirmativeAction: PropTypes.func,
    toggleDialog: PropTypes.func.isRequired,
  };

  handleAffirmative = () => {
    let {affirmativeAction, toggleDialog} = this.props;
    if (affirmativeAction) {
      affirmativeAction();
    }
    toggleDialog();
  };

  render() {
    let {heading, affirmativeText, negativeText, toggleDialog} = this.props;
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {heading || 'Confirm'}
        </DialogTitle>
        <DialogContent>
          {this.props.children}
        </DialogContent>
        <Divider/>
        <DialogActions>
          <Button
            variant='raised'
            onClick={toggleDialog}
            color="secondary"
            style={{marginRight: '10px'}}
          >
            {negativeText||'No'}
          </Button>
          <Button
            variant='raised'
            onClick={this.handleAffirmative}
            color="primary"
            autoFocus
          >
            {affirmativeText||'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default Modal;
