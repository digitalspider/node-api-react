import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {Link} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

const styles = (theme) => ({
  navbar: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.navbar,
    marginBottom: 15,
  },
  title: {
    'textDecoration': 'none',
    'cursor': 'pointer',
    '&:hover': {
      'textDecoration': 'none',
    },
  },
});

class NavBar extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div id="navbar" className={classes.navbar}>
        <Typography variant="h4" gutterBottom>
          <Link component={RouterLink} to="/"
            className={classes.title}>NavBar</Link>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
