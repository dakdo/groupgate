import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
// import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import configureStore from './store'
import {Route, Switch} from 'react-router'
import Login from './containers/Login';
import SignUp from './containers/SignUp';
import PrivateRoute from './containers/PrivateRoute';
// import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage'


const history = createHistory()
const store = configureStore(history)
ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
		<Switch>
			<Route exact path="/login/" component={Login} />
			<Route exact path='/signup'       component={SignUp} />
			<PrivateRoute path="/" component={App}/>
		</Switch>
    </ConnectedRouter>
  </Provider>
), document.getElementById('root'));

registerServiceWorker();