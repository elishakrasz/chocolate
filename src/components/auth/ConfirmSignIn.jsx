import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger, JS } from 'aws-amplify';

const logger = new Logger('ConfirmSignIn');

export default class ConfirmSignIn extends Component {
  constructor(props) {
    super(props);
    this.confirmSignIn = this.confirmSignIn.bind(this);
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

  confirmSignIn() {
    const user = this.props.authData;
    const { code } = this.inputs;
    logger.info('confirm sign in with ' + code);
    const mfaType = user.challengeName === 'SOFTWARE_TOKEN_MFA'
      ? 'SOFTWARE_TOKEN_MFA'
      : null;
    Auth.confirmSignIn(user, code, mfaType)
      .then(() => this.confirmSuccess(user))
      .catch(err => this.confirmError(err));
  }

  confirmSuccess(user) {
    logger.info('confirm sign in success', user);
    this.setState({ error: '' });

    this.checkContact(user);
  }

  confirmError(err) {
    logger.info('confirm sign in error', err);
    this.setState({ error: err.message || err });
  }

  checkContact(user) {
    Auth.verifiedContact(user)
      .then(data => {
        logger.info('verified contacts', data);
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      })
      .catch(err => {
        logger.info('check verified contact error', err);
      });
  }

  render() {
    const { authState } = this.props;
    if (authState !== 'confirmSignIn') { return null; }

    const { error } = this.state;

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
          type='text' 
          iconPosition='left' 
          placeholder='Code' 
          onChange={event => this.inputs.code = event.target.value}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
          />

          <Button style={{
            backgroundColor: 'rgb(0, 61, 121)',
            color: 'white'
          }} fluid size='large'  onClick={this.confirmSignIn}>
            Confirm Sign In
          </Button>
        </Segment>
      </Form>
      <Message>
        Back to<a href='#' onClick={() => this.changeState('signIn')}>Sign In</a>
      </Message>
      { error && <Message warning mt="3" text="left" >{error}</Message> }
    </Grid.Column>
  </Grid>
    )
  }
}
