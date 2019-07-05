import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
  status: {
    ...theme.typography,
  },
  before: {
    width: 8,
    height: 8,
    borderRadius: 4,
    display: 'inline-block',
    marginRight: 10,
    border: '1px solid black',
    background: 'none',
  },
});

const DataStatus = (props) => {
  const {
    className,
    classes,
    name,
  } = props;
  return (
    <span className={`${classes.status} ${className}`}>
      <span
        style={{
          borderColor: '#red',
          backgroundColor: '#black',
        }}
        className={classes.before}
      />
      {name}
    </span>
  );
};

DataStatus.propTypes = {
  /**
   * Default classes applied to this component
   */
  classes: PropTypes.object.isRequired,
  /**
   * Additional classes passed from referencing the component
   */
  className: PropTypes.string,
  /**
  * Status name
  */
  name: PropTypes.string.isRequired,
};

export default withStyles(styles)(DataStatus);
