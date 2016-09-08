import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import withRouter from 'react-router/lib/withRouter';
import browserHistory from 'react-router/lib/browserHistory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import IndexRoute from 'react-router/lib/IndexRoute';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl';
import App from './App';
import Home from './views/Home/Home';
import GetListed from './views/GetListed/GetListed';
import LoginView from './views/LoginView/LoginView';
import SignupView from './views/SignupView/SignupView';
import SearchView from './views/Search/Search';
import injectTapEventPlugin from 'react-tap-event-plugin';
import localStore from 'store2';

import authReducers from './redux/reducers/auth';
import searchReducers from './redux/reducers/search';
import './index.css';

const reactRouterMiddleware = routerMiddleware(browserHistory)

const store = createStore(
  combineReducers({
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

const MUI = () => (
  <IntlProvider locale="en">
    <MuiThemeProvider>
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={withRouter(Home)}/>
            <Route path="getlisted" component={GetListed} />
            <Route path="search" component={SearchView} />
            <Route path="login" component={LoginView} />
            <Route path="signup" component={SignupView} />
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>
  </IntlProvider>
);

injectTapEventPlugin();
ReactDOM.render(
  <MUI />,
  document.getElementById('root')
);
