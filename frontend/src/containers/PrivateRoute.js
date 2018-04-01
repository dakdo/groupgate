import React from 'react'
import { Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import * as reducers from '../reducers'

const PrivateRoute = ({ component: Component, accessToken, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated ? (
      <Component {...props} accessToken={accessToken}/>
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
  accessToken: reducers.accessToken(state)
})

export default connect(mapStateToProps, null)(PrivateRoute);