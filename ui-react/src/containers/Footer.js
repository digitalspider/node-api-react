import React from 'react';
import Typography from '@material-ui/core/Typography';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <Typography variant="body1" align="center">
      &copy; digitalspider.com.au {currentYear}
    </Typography>
  );
}

export default Footer;
