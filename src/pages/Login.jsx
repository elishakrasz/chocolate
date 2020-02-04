import React, { Component } from 'react';
// import { Lead, BSpan } from 'bootstrap-4-react';
import { Authenticator } from 'aws-amplify-react';

import {
  SignIn,
  ConfirmSignIn,
  SignUp,
  ConfirmSignUp,
  ForgotPassword,
  ForgotPasswordReset
} from '../components/auth';

const CustomAuthenticator = props => (
  <Authenticator hideDefault>
    <SignIn />
    <ConfirmSignIn />
    <SignUp />
    <ConfirmSignUp />
    <ForgotPassword />
    <ForgotPasswordReset />
  </Authenticator>
)

export default class Login extends Component {
  render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        { !user && <CustomAuthenticator /> }
        { user && <span>You are signed in as <span font="italic">{user.username}</span>.</span> }
      </React.Fragment>
    )
  }
}
