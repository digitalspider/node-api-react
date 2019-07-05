import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Section from '../components/common/Section';
import { Input, Button, Grid } from '@material-ui/core';
import Api from '../utils/Api';
import Storage from '../utils/Storage';

const BASE_URL=process.env.REACT_APP_BASE_URL;

const styles = (theme) => ({
  section: {
    padding: '15px 0',
  },
});

class LoginPage extends Component {
  constructor(){
    super();
    this.state = {
      auth: {
        username : '',
        password : '',
      },
    }
  }

  handleLogin = async () => {
    let data = this.state.auth;
    let response = await Api.post(BASE_URL+'/api/v1/auth/login', data);
    console.log('resp='+JSON.stringify(response));
    if (response.status===200) {
      console.log('New token='+response.data.token);
      console.log('User='+response.data.username);
      Storage.setSession(response.data);
      this.props.history.push('/');
    } else if (response.status===401) {
      console.log('Invalid login!!!');
    } else {
      console.log(response);
    }
  }

  handleInput = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    this.setState( prevState => {
       return { 
          auth : {
            ...prevState.auth, [name]: value
          }
       }
    });
  }

  render() {
    const {classes} = this.props;
    return (
      <Section className={classes.section}>
        <Typography variant="h4" gutterBottom>
        Login Page
        </Typography>
        <Grid>
          <Grid item>
            <Input type='text' name="username" placeholder='Username' onChange={this.handleInput}/>
          </Grid>
          <Grid item>
            <Input type='password' name="password" placeholder='Password' onChange={this.handleInput}/>
          </Grid>
        </Grid>
        <Button
            variant='raised'
            color="primary"
            onClick={this.handleLogin}
            style={{marginRight: '10px'}}
          >
            Login
          </Button>
          <Button
            variant='raised'
            onClick={this.handleForgot}
            color="secondary"
          >
            Forgot Password?
          </Button>
      </Section>
    );
  }
}

export default withStyles(styles)(LoginPage);
