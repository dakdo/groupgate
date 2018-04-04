import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'
import {logout} from  '../actions/auth'

const PrivateRoute = ({ component: Component, access, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated ? (
      <Component {...props} access={access}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const mapStateToProps = (state) => ({
  isAuthenticated: reducers.isAuthenticated(state),
  access: reducers.getAccess(state)
})

const mapDispatchToProps = (dispatch) => ({
  logOut: () => {
    dispatch(logout())
  }
})
  
export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);