import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('ConfirmSignUp');

export default class ConfirmSignUp extends Component {
  constructor(props) {
    super(props);
    this.confirmSignUp = this.confirmSignUp.bind(this);
    this.resendCode = this.resendCode.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { message: '', error: '' }
  }

  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  confirmSignUp() {
    const username = this.props.authData || this.inputs.username;
    const { code } = this.inputs;
    logger.info('confirm sign up with ' + code);
    Auth.confirmSignUp(username, code)
      .then(() => this.confirmSuccess(username))
      .catch(err => this.handleError(err));
  }

  resendCode() {
    const username = this.props.authData || this.inputs.username;
    logger.info('resend code to ' + username);
    Auth.resendSignUp(username)
      .then(() => this.setState({ message: 'Code sent' }))
      .catch(err => this.handleError(err));
  }

  confirmSuccess(username) {
    logger.info('confirm sign up success with ' + username);
    this.setState({ message: '', error: '' });
    this.changeState('signIn', username);
  }

  handleError(err) {
    logger.info('confirm sign up error', err);
    this.setState({ message: '', error: err.message || err });
  }

  render() {
    const { authState, authData } = this.props;
    if (authState !== 'confirmSignUp') { return null; }

    const { message, error } = this.state;

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
        <Image src='/logo.png' /> Log-in to your account
      </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input 
          fluid icon='user' 
          iconPosition='left' 
          placeholder='Username' 
          defaultValue={authData || ''}
          onChange={event => this.inputs.username = event.target.value}
            htmlDisabled={!!authData}
          />
          <Form.Input
            fluid
            type='text'
            icon='lock'
            iconPosition='left'
            placeholder='Code'
            onChange={event => this.inputs.code = event.target.value}
          />

          <Button.Group>  
            <Button fluid color='teal' onClick={this.confirmSignUp}>Confirm</Button>
            <Button fluid color='red' onClick={this.resendCode}>Resend</Button>
          </Button.Group>
        </Segment>
      </Form>
      <Message>
       Back to <a href='#' onClick={() => this.changeState('signIn')}>Sign In</a>
      </Message>
      { message && <Message>{message}</Message> }
          { error && <Message>{error}</Message> }
    </Grid.Column>
  </Grid>
    )
  }
}
