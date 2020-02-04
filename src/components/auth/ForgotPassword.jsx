import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';
import logo from '../icons/dlogo2.png'

const logger = new Logger('ForgotPassword');

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.sendCode = this.sendCode.bind(this);
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

  sendCode() {
    const username = this.props.authData || this.inputs.username;
    logger.info('resend code to ' + username);
    Auth.forgotPassword(username)
      .then(data => this.sendSuccess(username, data))
      .catch(err => this.handleError(err));
  }

  sendSuccess(username, data) {
    logger.info('sent code for ' + username, data);
    this.changeState('forgotPasswordReset', username);
  }

  handleError(err) {
    logger.info('forgot password send code error', err);
    this.setState({ error: err.message || err });
  }

  render() {
    const { authState, authData } = this.props;
    if (authState !== 'forgotPassword') { return null; }

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
            }} src={logo} /> Forgot Password
          </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input 
          fluid icon='user' 
          iconPosition='left' 
          placeholder='Username' 
          defaultValue={authData || ''}
            onChange={event => this.inputs.username = event.target.value}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
          />

          <Button 
         style={{
          backgroundColor: 'rgb(0, 61, 121)',
          color: 'white'
        }} 
          fluid size='large'
          onClick={this.sendCode}>
            Send Password Reset Code
          </Button>
        </Segment>
      </Form>
      <Message>
        Back to <a href='#' onClick={() => this.changeState('signIn')}>Sign In</a>
      </Message>
      { error && <Message>{error}</Message> }
    </Grid.Column>
  </Grid>
    )
  }
}
