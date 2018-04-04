import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'

const PrivateRoute = ({ component: Component, access, isAuthenticated, dispatch, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated ? (
      <Component {...props} access={access} dispatch={dispatch}/>
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
  dispatch: dispatch
})
  
export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);