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

// import Raven from 'raven-js';
// import { IntlProvider } from 'react-intl';
// global.Intl = require('intl');
import injectTapEventPlugin from 'react-tap-event-plugin';
import localStore from 'store2';

import App from './App';

import { reducer as formReducer } from 'redux-form'
import viewReducers from './redux/reducers/view';
import authReducers from './redux/reducers/auth';
import searchReducers from './redux/reducers/search';
import listReducers from './redux/reducers/list';
import dashboardReducers from './redux/reducers/dashboard';
import clientbookReducers from './redux/reducers/clientbook';

import './index.css';

import axios from 'axios'

// Raven.config('https://428f8ff22ea44869a1b6410cf83d7905@sentry.io/101570').install();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'rgba(48, 73, 102, 0.7)',
    primary2Color: 'rgb(48, 73, 102)'
  },
});

const reactRouterMiddleware = routerMiddleware(browserHistory)

const store = createStore(
  combineReducers({
    view: viewReducers,
    form: formReducer,
    auth: authReducers,
    search: searchReducers,
    list: listReducers,
    dashboard: dashboardReducers,
    clientbook: clientbookReducers,
    routing: routerReducer
  }),
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(reactRouterMiddleware)
)
const history = syncHistoryWithStore(browserHistory, store)

axios.interceptors.request.use(function (config) {
  let urlArray = config.url.split('/')
  if (urlArray && urlArray[1] === 'api' && urlArray[2] !== 'public') {
    if (store.getState().auth.token) {
      config.headers["Authorization"] = "Bearer " + store.getState().auth.token
    } else {
      Promise.reject({
        message: "Need Authorization Token"
      })
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

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

function requireAuthLogin(nextState, replace) {
  if (!store.getState().auth.isLogin) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function requireAuthAdvisor(nextState, replace) {
  if (!store.getState().auth.isLogin || store.getState().auth.role === 1) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function requireAuthBlogEditor(nextState, replace) {
  if (!store.getState().auth.isLogin || !store.getState().auth.role !== 101) {
    replace({
      pathname: '/siteblog'
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
          <IndexRoute getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Home/Home').default)
              })
            }}>
          </IndexRoute>
          <Route path="/getlisted" onEnter={requireHaveNotListed} getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/GetListed/GetListed').default)
              })
            }}>
          </Route>
          <Route path="/search" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Search/Search').default)
              })
            }}>
          </Route>
          <Route path="/login" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/LoginView/LoginView').default)
              })
            }}>
          </Route>
          <Route path="/signup" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/SignupView/SignupView').default)
              })
            }}>
          </Route>
          <Route path="/dashboard" onEnter={requireAuthLogin}>
            <IndexRoute getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/Dashboard/Dashboard').default)
                })
              }}>
            </IndexRoute>
            <Route path="calendar" onEnter={requireAuthAdvisor} getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/ManageCalendar/ManageCalendar').default)
                })
              }}>
            </Route>
            <Route path="clients" onEnter={requireAuthAdvisor} getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/Dashboard/Clients/Clients').default)
                })
              }}>
            </Route>
            <Route path="feedback" onEnter={requireAuthAdvisor} getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/Dashboard/ManageFeedback/ManageFeedback').default)
                })
              }}>
            </Route>
          </Route>
          <Route path="/p/:id" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Profile/Profile').default)
              })
            }}>
          </Route>
          <Route path="/feedback/:id" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Feedback/Feedback').default)
              })
            }}>
          </Route>
          <Route path="/verify-email/:token" getComponent={function(location, cb){
              require.ensure([], (require) => {
                cb(null, require('./views/Verifyemail/Verifyemail').default)
              })
            }}>
          </Route>
          <Route path="/siteblog">
            <IndexRoute getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/Siteblog/Siteblog').default)
                })
              }}>
            </IndexRoute>
            <Route path="new" onEnter={requireAuthBlogEditor} getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/Siteblog/NewSiteblog').default)
                })
              }}>
            </Route>
            <Route path=":id" getComponent={function(location, cb){
                require.ensure([], (require) => {
                  cb(null, require('./views/Siteblog/SiteblogDetail').default)
                })
              }}>
            </Route>
          </Route>
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
