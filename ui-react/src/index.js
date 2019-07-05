import React from 'react';
import ReactDOM from 'react-dom';
import MainRouter from './routers/MainRouter';
import './index.css';
import {MuiThemeProvider} from '@material-ui/core/styles';
import stores from './stores';
import {Provider} from 'mobx-react';
import Notifier from './components/Notifier';
import getTheme from './theme';
import {BrowserRouter} from 'react-router-dom/cjs/react-router-dom';

const theme = getTheme();

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider {...stores}>
        <React.Fragment>
          <BrowserRouter>
            <MainRouter />
          </BrowserRouter>
          <Notifier />
        </React.Fragment>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
