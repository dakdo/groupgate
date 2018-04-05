import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { withRouter } from 'react-router-dom';

import LoginForm from '../components/forms/LoginForm'
import {login, resetSignup } from  '../actions/auth'
import {authErrors, isAuthenticated} from '../reducers'
import SignInPage from '../pages/SignInPage'
const Login = (props) => {
  if(props.isAuthenticated) {
     return  <Redirect to='/' />
  }

  return (
     <div className="login-page">
       <SignInPage {...props} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username, password) => {
    dispatch(login(username, password))
  },
  resetSignup : () => {
    dispatch(resetSignup())
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));