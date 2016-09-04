import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'whatwg-fetch';

import './index.css';
import 'flexboxgrid/css/flexboxgrid.min.css'

const MUI = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

injectTapEventPlugin();
ReactDOM.render(
  <MUI />,
  document.getElementById('root')
);
