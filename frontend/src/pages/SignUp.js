import React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router'

import LoginForm from '../components/forms/LoginForm'
import {signup} from  '../actions/auth'
import {authErrors, isSignedUp} from '../reducers'
import SignUpPage from '../pages/SignUpPage'
const SignUp = (props) => {
  if(props.isSignedUp) {
     return  <Redirect to='/login/' />
  }

  return (
     <div className="signup-page">
       <SignUpPage {...props} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isSignedUp: isSignedUp(state)
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (data) => {
    dispatch(signup(data))
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));