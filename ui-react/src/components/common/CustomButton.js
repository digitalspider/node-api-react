import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
  // default style of a custom button
  genericButton: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: '36px',
    padding: '0 16px',
    textTransform: 'none',
    color: 'rgb(64,64,64)',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    minWidth: 0,
    borderRadius: 4,
    border: '1px solid #dadada',
    '&:hover': {
      backgroundColor: '#0000001f',
    },
  },
  // css style for 'filter button'
  filterButton: {
    padding: '0 16px',
    minHeight: 30,
    minWidth: 0,
    backgroundColor: '#f0f0f0',
    color: '#404040',
    textTransform: 'none',
    lineHeight: '30px',
    border: '1px solid #a4a4a4',
    fontWeight: 600,
    fontSize: '13px',
    opacity: '0.8',
    borderRadius: 2,
  },
  // css style for 'apply button'
  applyButton: {
    color: '#ffffff',
    backgroundColor: '#e41c23',
    minWidth: 0,
    lineHeight: '36px',
    padding: '0 16px',
    borderRadius: 4,
    textTransform: 'none',
    marginLeft: 10,
    fontWeight: 700,
    '&:hover': {
      'backgroundColor': '#e9494f',
    },
  },
};

const CustomButton = ({
  className,
  classes,
  buttonType,
  ...props
}) => {
  return (
    <Button
      className={`${className} ${classes[buttonType]}`}
      {...props}
    >
    </Button>
  );
};

CustomButton.propTypes = {
  /**
   * Default classes applied to this component
   */
  classes: PropTypes.object,
  /**
   * Default button type applied to this component
   */
  buttonType: PropTypes.string,
  /**
   * Additional classes passed from referencing the component
   */
  className: PropTypes.string,
  /**
  * Callback when clicking the button
  */
};

export default withStyles(styles)(CustomButton);
