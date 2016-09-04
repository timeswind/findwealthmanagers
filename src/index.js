import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import browserHistory from 'react-router/lib/browserHistory'
import IndexRoute from 'react-router/lib/IndexRoute'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import Home from './views/Home/Home'
import GetListed from './views/GetListed/GetListed'
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'whatwg-fetch';

import './index.css';
import 'flexboxgrid/css/flexboxgrid.min.css'

const MUI = () => (
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/* add it here, as a child of `/` */}
        <IndexRoute component={Home}/>
        <Route path="/getlisted" component={GetListed}/>
      </Route>
    </Router>
  </MuiThemeProvider>
);

injectTapEventPlugin();
ReactDOM.render(
  <MUI />,
  document.getElementById('root')
);
