import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../components/forms/SignUpForm'
import logoImg from "../assets/logo.png"
import '../css/style.css';


export default class SignUpPage extends Component {

render(){
  return(
    <div className="container-fluid">

      <nav className="navbar">
        <img className="logo" src={logoImg } alt="Logo" width="50"/>
        <h1 className="mr-auto">Group Gate</h1>

        <Link to="/">Sign In</Link>
      </nav><br/><br/>



      {/* Body */}
      <div>
        <h2 className="text-center notBold">Starting new class or personal group project? </h2>
        <h2 className="text-center notBold">Find the right people. Fast.</h2><br/>
        <h5 className="text-center notBold">Create Group. Find People. Finish Project. Provide Feedback.</h5><br/><br/>
        {/* Login Form */}
        <div className="d-flex justify-content-center">
            <SignUpForm onSubmit={this.props.onSubmit} />
        </div>
        <p className="text-center">Already have an account? <Link to="/">Sign In</Link></p>
      </div>
    </div>
  );
}

}
