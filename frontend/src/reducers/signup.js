
import * as auth from '../actions/auth'
const initialState = {
  requesting: false,
  signed_up: false,
  errors: {},
}
export default (state=initialState, action) => {
  switch(action.type) { 
    case auth.SIGNUP_REQUEST:
      return {
        requesting: true,
        signed_up: false,
        errors: {}
      }
    case auth.SIGNUP_SUCCESS:
      return {
        requesting: false,
        signed_up: true,
        errors: {}
      }

    case auth.SIGNUP_FAILURE:
      return {
         requesting: false,
         signed_up: false
      }
    default:
      return state
    }
}

export function isSignedUp(state) {
  return state.signed_up
}
export function errors(state) {
   return  state.errors
}