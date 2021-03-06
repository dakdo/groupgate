import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import SignUpPage from './pages/SignUpPage'
import Nav from './components/Nav';
import MyProfilePage from './pages/MyProfilePage';
import ProjGroupsPage from './pages/ProjGroupsPage';
import OtherUsersPage from './pages/OtherUsersPage';
import OtherUserDetails from './components/OtherUserDetails';
import RatingPage from './pages/RatingPage';

const App = (props) => (
	

	<div className="container fluid">
	<Nav access={this.access} dispatch={props.dispatch}/>
	<Switch>
		{/* <Route path='/' exact component={SignInPage} /> */}
		{/* <Route path='/signup' exact component={SignUpPage} /> */}
		<Route exact path='/' render={()=><MyProfilePage access={props.access}/>}/>
		<Route path='/projGroups' render={()=><ProjGroupsPage access={props.access}/>}/>
		<Route path='/otherUsers' render={()=><OtherUsersPage access={props.access}/>}/>
		<Route path='/otherUsers/:id' render={()=><OtherUserDetails access={props.access}/>}/>
		<Route path='/rating' render={()=><RatingPage access={props.access}/>}/>
	</Switch>
	</div>
)

export default App;
