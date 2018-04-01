import React from 'react';
import { Switch, Route } from 'react-router-dom';


// import SignUpPage from './pages/SignUpPage'
import MyProfilePage from './pages/MyProfilePage';
import ProjGroupsPage from './pages/ProjGroupsPage';
import OtherUsersPage from './pages/OtherUsersPage';
import OtherUserDetails from './components/OtherUserDetails';
import RatingPage from './pages/RatingPage';

const App = (props) => (

	<Switch>
		{/* <Route path='/' exact component={SignInPage} /> */}
		{/* <Route path='/signup' exact component={SignUpPage} /> */}
		<Route path='/' render={()=><MyProfilePage accessToken={props.accessToken}/>}/>
		<Route path='/projGroups' render={()=><ProjGroupsPage accessToken={props.accessToken}/>}/>
		<Route path='/otherUsers' render={()=><OtherUsersPage accessToken={props.accessToken}/>}/>
		<Route path='/otherUsers/:id' render={()=><OtherUserDetails accessToken={props.accessToken}/>}/>
		<Route path='/rating' render={()=><RatingPage accessToken={props.accessToken}/>}/>
	</Switch>

)

export default App;
