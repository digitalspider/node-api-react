import React from 'react';
import {inject, observer} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles';
import Check from '@material-ui/icons/CheckCircle';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  icon: {
    verticalAlign: 'bottom',
    fontSize: 28,
  },
  snackContent: {
    boxShadow: '0px 0px 20px 5px rgba(0,0,0,0.20)',
    borderRadius: 10,
    background: '#ffffff',
    minWidth: 500,
  },
  snackContentHead: {
    backgroundColor: '#404040',
    minHeight: 60,
    borderRadius: '4px 4px 0 0',
    padding: '0 30px',
  },
  snackContentMessage: {
    padding: '20px 30px',
  },
  snackHead: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 600,
    paddingTop: 15,
  },
  snackMessage: {
    color: 'rgba(0,0,0,.54)',
  },
};

class Notifier extends React.Component {
  handleClose() {
    this.props.notifier.handleClose();
  };

  render() {
    const {classes} = this.props;

    // Define snack attributes based on type
    let snackProps = {icon: ''};
    switch (this.props.notifier.type) {
      case 'success':
        snackProps = {
          icon: <Check className={classes.icon} />,
        };
        break;
      case 'error':
        snackProps = {
          icon: <ErrorOutline className={classes.icon} />,

        };
        break;
      case 'warning':
        snackProps = {
          icon: <ErrorOutline className={classes.icon} />,
        };
        break;
      default:
        break;
    }
    return (
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={this.props.notifier.open}
        onClose={this.handleClose}
        autoHideDuration={5000}
      >
        <div className={classes.snackContent}>
          <div className={classes.snackContentHead}>
            <Typography variant='h6' className={classes.snackHead}>
              {snackProps.icon} {this.props.notifier.title}
            </Typography>
          </div>
          <div className={classes.snackContentMessage}>
            {this.props.notifier.content.map((message) => (
              <Typography variant='body1' className={classes.snackMessage} key={message}>
                {message}
              </Typography>
            ))}
          </div>
        </div>
      </Snackbar>
    );
  }
}

export default inject("notifier")(observer(withStyles(styles)(Notifier)));
