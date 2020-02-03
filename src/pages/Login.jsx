import React, { Component } from 'react';
import { Lead, BSpan } from 'bootstrap-4-react';
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
        { user && <Lead>You are signed in as <BSpan font="italic">{user.username}</BSpan>.</Lead> }
      </React.Fragment>
    )
  }
}
