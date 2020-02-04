import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger, JS } from 'aws-amplify';
import logo from '../icons/dlogo2.png'

const logger = new Logger('SignIn');


export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.checkContact = this.checkContact.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { error: '' }
  }

  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  signIn() {
    const { username, password } = this.inputs;
    logger.info('sign in with ' + username);
    Auth.signIn(username, password)
      .then(user => this.signInSuccess(user))
      .catch(err => this.signInError(err));
  }

  signInSuccess(user) {
    logger.info('sign in success', user);
    this.setState({ error: '' });

    // There are other sign in challenges we don't cover here.
    // SMS_MFA, SOFTWARE_TOKEN_MFA, NEW_PASSWORD_REQUIRED, MFA_SETUP ...
    if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      this.changeState('confirmSignIn', user);
    } else {
      this.checkContact(user);
    }
  }

  signInError(err) {
    logger.info('sign in error', err);
    /*
      err can be in different structure:
        1) plain text message;
        2) object { code: ..., message: ..., name: ... }
    */
    this.setState({ error: err.message || err });
  }

  checkContact(user) {
    Auth.verifiedContact(user)
      .then(data => {
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      });
  }

  render() {
    const { authState, authData } = this.props;
    if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }

    const { error } = this.state;

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' textAlign='center' style={{
              color: '#003D79',
              marginTop: '15px'
          }}>
            <Image style={{
                marginBottom: '10px'
            }} src={logo} /> Sign in to your Account
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input 
                fluid icon='user' 
                iconPosition='left' 
                placeholder='Username/E-mail address' 
                defaultValue={authData || '' }
                onChange={event => this.inputs.username = event.target.value}
                />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                onChange={event => this.inputs.password = event.target.value}
              />
    
              <Button 
                style={{
                    backgroundColor: '#003D79',
                    color: 'white'
                }}
                fluid size='large'
                onClick={this.signIn}
                >
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <a href='#'  onClick={() => this.changeState('signUp')}>Sign Up</a><span>{"     "}
            Forgot Password <a href='#'  onClick={() => this.changeState('forgotPassword')}>Click Here</a>
            </span>
          </Message>
          
          { error && <Message>{error}</Message> }
        </Grid.Column>
      </Grid>
    )
  }
}
