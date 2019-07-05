import React from 'react';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
  button: {
    color: '#257be6',
    fontWeight: 600,
    '&:hover': {
      color: '#404040',
      cursor: 'pointer',
    },
  },
  icon: {
    fontSize: '14px',
  },
};

const EditButton = ({className, classes, onClick}) => {
  return (
    <Typography
      className={`${className} ${classes.button}`}
      onClick={onClick}
    >
      <EditIcon className={classes.icon}/>
      Edit
    </Typography>
  );
};

EditButton.propTypes = {
  /**
   * Default classes applied to this component
   */
  classes: PropTypes.object.isRequired,
  /**
   * Additional classes passed from referencing the component
   */
  className: PropTypes.string,
  /**
  * Callback when clicking the button
  */
  onClick: PropTypes.func,
};

export default withStyles(styles)(EditButton);
