import { RSAA } from 'redux-api-middleware';
export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@auth/LOGIN_FAILURE';
export const LOGOUT = '@@auth/LOGOUT';
export const TOKEN_REQUEST = '@@auth/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@auth/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@auth/TOKEN_FAILURE';
export const SIGNUP_REQUEST =  '@@auth/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = '@@auth/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = '@@auth/SIGNUP_FAILURE';

export const login = (username, password) => ({
  [RSAA]: {
    endpoint: '/api/auth/token/obtain/',
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: { 'Content-Type': 'application/json' },
    types: [
      LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
    ]
  }
})
export const refreshAccessToken = (token) => ({
  [RSAA]: {
    endpoint: '/api/auth/token/refresh/',
    method: 'POST',
    body: JSON.stringify({refresh: token}),
    headers: { 'Content-Type': 'application/json' },
    types: [
      TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
    ]
  }
})

export const signup = (data) =>({
  [RSAA]: {
    endpoint: '/api/users/',
    method: 'POST',
    body: JSON.stringify({username: data.username, 
                          password: data.password,
                          display_name: data.display_name,
                          first_name: data.first_name,
                          last_name: data.last_name,
                          groups: data.groups}),
    headers: { 'Content-Type': 'application/json' },
    types: [
      SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE
    ]
  }
})

export const logout = () => {
  return {
    type: LOGOUT
  }
}
