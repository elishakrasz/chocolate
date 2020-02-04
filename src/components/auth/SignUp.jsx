import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';
import logo from '../icons/dlogo2.png'

const logger = new Logger('SignUp');

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
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

  signUp() {
    const { username, password, email, phone_number } = this.inputs;
    logger.info('sign up with ' + username);
    Auth.signUp(username, password, email, phone_number)
      .then(() => this.signUpSuccess(username))
      .catch(err => this.signUpError(err));
  }

  signUpSuccess(username) {
    logger.info('sign up success with ' + username);
    this.setState({ error: '' });

    this.changeState('confirmSignUp', username);
  }

  signUpError(err) {
    logger.info('sign up error', err);
    let message = err.message || err;
    if (message.startsWith('Invalid phone number')) {
      // reference: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
      message = 'Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.'
    }
    this.setState({ error: message });
  }

  render() {
    const { authState } = this.props;
    if (authState !== 'signUp') { return null; }

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
            }} src={logo} /> 
            Sign Up For an Account
      </Header> 
      <Form size='large'>
        <Segment stacked>
          <Form.Input 
          fluid icon='user' 
          iconPosition='left' 
          placeholder='Username'
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
            <Form.Input 
          fluid icon='mail' 
          iconPosition='left' 
          placeholder='E-mail address'
          onChange={event => this.inputs.email = event.target.value}
          />
            <Form.Input 
          fluid icon='phone' 
          iconPosition='left' 
          placeholder='Phone Number'
          onChange={event => this.inputs.phone_number = event.target.value}
          />
          <Button style={{
            backgroundColor: 'rgb(0, 61, 121)',
            color: 'white'
          }}
            fluid size='large'
            onClick={this.signUp}
            >
            Create Account
          </Button>
        </Segment>
      </Form>
      <Message>
        <a href='#' onClick={() => this.changeState('signIn')}>Back to Sign In</a>
      </Message>
      { error && <Message>{error}</Message> }
    </Grid.Column>
  </Grid>
    )
  }
}
