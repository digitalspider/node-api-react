import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
  root: {
    'margin': '0px auto',
    'width': '80%',
    '@media only screen and (min-width: 768px) and (max-width: 1320px)': {
      width: '98%',
    },
  },
};

const Section = ({classes, className, children}) => {
  return (
    <section className={`${classes.root} ${className}`}>
      {children}
    </section>
  );
};

Section.propTypes = {
  /**
   * Default classes applied to this component
   */
  classes: PropTypes.object.isRequired,
  /**
   * Optional additional classes
   */
  className: PropTypes.string,
  /**
  * Callback when clicking the button
  */
  children: PropTypes.object.isRequired,
};

export default withStyles(styles)(Section);
