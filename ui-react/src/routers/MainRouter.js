import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Main from './../containers/Main';
import LoginPage from '../containers/LoginPage';

class MainRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={LoginPage}/>
        <Route path="/" component={Main} />
      </Switch>
    );
  }
}

export default MainRouter;
