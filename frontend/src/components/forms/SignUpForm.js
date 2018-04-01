import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Message } from "semantic-ui-react";
import Validator from "validator";
import InlineError from "../messages/InlineError";

export default class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: "",
        displayName: "",
        password: "",
        retypePassword: "",
      },
    loading: false,
    errors: {}
  };
  this.onChange = this.onChange.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      var data = {
        "username": this.state.data.email,
        "password": this.state.data.password,
        "first_name": "foo",
        "last_name": "bar",
        "display_name": this.state.data.displayName,
        "groups": []

      }
      this.props.onSubmit(data)          // <------------------------
        
    }
  };

  // VALIDATE email and password
  validate = data => {
    const errors = {};
    if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.displayName) errors.displayName = "Can't be blank";
    if (!data.password) errors.password = "Can't be blank";
    if (!data.retypePassword) errors.retypePassword = "Can't be blank";
    if ( data.password !== data.retypePassword) errors.retypePassword = "Passwords do not match";
    return errors;
  };

  render() {
      const { data, errors, loading } = this.state;

      return (

        <Form className="ui form center" onSubmit={this.onSubmit} loading={loading}>
          {errors.global && (
            <Message negative>
              <Message.Header>Something went wrong</Message.Header>
              <p>{errors.global}</p>
            </Message>
          )}
          {/*Email Input*/}
          <Form.Field error={!!errors.email}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              className="login-form-control"
              placeholder="(Wil be used to Sign In)"
              value={data.email}
              onChange={this.onChange}
            />
            {errors.email && <InlineError text={errors.email} />}
          </Form.Field>
          {/*Display Name Input*/}
          <Form.Field error={!!errors.displayName}>
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className="login-form-control"
              placeholder="(Your display name)"
              value={data.displayName}
              onChange={this.onChange}
            />
            {errors.displayName && <InlineError text={errors.displayName} />}
          </Form.Field>
          {/*Password Input*/}
          <Form.Field error={!!errors.password}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="login-form-control"
              placeholder="Make it secure"
              value={data.password}
              onChange={this.onChange}
            />
            {errors.password && <InlineError text={errors.password} />}
          </Form.Field>
          {/*Validate Password Input*/}
          <Form.Field error={!!errors.retypePassword}>
            <label htmlFor="retypePassword">Retype Password</label>
            <input
              type="password"
              id="retypePassword"
              name="retypePassword"
              className="login-form-control"
              placeholder="(Make sure they match)"
              value={data.retypePassword}
              onChange={this.onChange}
            />
            {errors.retypePassword && <InlineError text={errors.retypePassword} />}
          </Form.Field>

          <Button primary className="login-form-control right">Crate Profile</Button>
        </Form>
      );
    }
  }

  SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
  };
