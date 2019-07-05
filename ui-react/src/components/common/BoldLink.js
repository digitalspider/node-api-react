import React from 'react';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  textLink: {
    'textDecoration': 'none',
    'fontWeight': 600,
    'color': theme.palette.common.black,
    'cursor': 'pointer',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.7)',
      textDecoration: 'underline',
    },
  },
});

const BoldLink = (props) => {
  const {classes} = props;
  return (
    <Link
      className={classes.textLink}
      {...props}
    >
      {props.children}
    </Link>
  );
};

BoldLink.propTypes = {
  to: PropTypes.string.isRequired,
};

export default withStyles(styles)(BoldLink);
