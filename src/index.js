import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import browserHistory from 'react-router/lib/browserHistory';
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import { useScroll } from 'react-router-scroll';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import IndexRoute from 'react-router/lib/IndexRoute';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import { IntlProvider } from 'react-intl';
// global.Intl = require('intl');
import injectTapEventPlugin from 'react-tap-event-plugin';
import localStore from 'store2';

import App from './App';
import Home from './views/Home/Home';
// import GetListedView from './views/GetListed/GetListed';
import LoginView from './views/LoginView/LoginView';
import SignupView from './views/SignupView/SignupView';
import SearchView from './views/Search/Search';
import DashboardView from './views/Dashboard/Dashboard';

import { reducer as formReducer } from 'redux-form'
import authReducers from './redux/reducers/auth';
import searchReducers from './redux/reducers/search';

import './index.css';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'rgba(48, 73, 102, 0.7)',
    primary2Color: 'rgb(48, 73, 102)'
  },
});

const reactRouterMiddleware = routerMiddleware(browserHistory)

const store = createStore(
  combineReducers({
    form: formReducer,
    auth: authReducers,
    search: searchReducers,
    routing: routerReducer
  }),
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(reactRouterMiddleware)
)
const history = syncHistoryWithStore(browserHistory, store)

if (localStore.session.get("token") && localStore.session.get("email") && localStore.session.get("id")) {
  store.dispatch({
    type: "SET_TOKEN",
    token: localStore.session.get("token")
  })
  store.dispatch({
    type: "SET_ID",
    id: localStore.session.get("id")
  })
  store.dispatch({
    type: "SET_NAME",
    name: localStore.session.get("name")
  })
  store.dispatch({
    type: "SET_EMAIL",
    email: localStore.session.get("email")
  })
  store.dispatch({
    type: "SET_ROLE",
    role: localStore.session.get("role")
  })
  store.dispatch({
    type: "SET_LOGIN_STATE",
    isLogin: true
  })
} else {
  localStore.session(false);
  store.dispatch({
    type: "SET_LOGIN_STATE",
    isLogin: false
  })
}

function requireAuth(nextState, replace) {
  if (!store.getState().auth.isLogin) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function requireHaveNotListed(nextState, replace, callback) {
  if (store.getState().auth.isLogin) {
    let advisor_id = store.getState().auth.id
    fetch('/api/public/list?type=advisor&id=' + advisor_id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success) {
        replace({
          pathname: '/dashboard',
          state: { nextPathname: nextState.location.pathname }
        })
      }
      callback();
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }
  callback();

}

const MUI = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Router history={history} render={applyRouterMiddleware(useScroll())}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="getlisted" onEnter={requireHaveNotListed} getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/GetListed/GetListed.js').default)
              })
            }}
            />
          <Route path="search" component={SearchView} />
          <Route path="login" component={LoginView} />
          <Route path="signup" component={SignupView} />
          <Route path="dashboard" component={DashboardView} onEnter={requireAuth} />
          <Route path="p/:id" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Profile/Profile').default)
              })
            }}
            />
          <Route path="clients" onEnter={requireAuth} getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Clients/Clients').default)
              })
            }}
            />
          <Route path="verify-email/:token" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Verifyemail/Verifyemail').default)
              })
            }}
            />

        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>
);

injectTapEventPlugin();
ReactDOM.render(
  <MUI />,
  document.getElementById('root')
);
