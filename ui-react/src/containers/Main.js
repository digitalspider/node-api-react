import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import NavBar from '../components/NavBar';
import AppRouter from './../routers/AppRouter';
import Footer from './Footer';
import Section from '../components/common/Section';

const styles = (theme) => ({
  main: {
    marginTop: 5,
  },
});

class Main extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Section className={classes.main}>
          <AppRouter />
        </Section>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Main);
