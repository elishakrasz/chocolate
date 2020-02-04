import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';
import logo from '../icons/dlogo2.png'

const logger = new Logger('ForgotPasswordReset');

export default class ForgotPasswordReset extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
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

  submit() {
    const username = this.props.authData;
    if (!username) {
      this.setState({ error: 'missing username' });
      return;
    }

    const { code, password } = this.inputs;
    logger.info('reset password for ' + username);
    Auth.forgotPasswordSubmit(username, code, password)
      .then(data => this.submitSuccess(username, data))
      .catch(err => this.handleError(err));
  }

  submitSuccess(username, data) {
    logger.info('forgot password reset success for ' + username, data);
    this.changeState('signIn', username);
  }

  handleError(err) {
    logger.info('forgot password reset error', err);
    this.setState({ error: err.message || err });
  }

  render() {
    const { authState } = this.props;
    if (authState !== 'forgotPasswordReset') { return null; }

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
            }} src={logo} /> Password Reset
          </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input
          type='text' 
          fluid icon='code' 
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
            onChange={event => this.inputs.password = event.target.value}
          />

          <Button 
            color='teal' 
            fluid size='large'
            onClick={this.submit}
            >
            Reset Password
          </Button>
        </Segment>
      </Form>
      <Message>
      Back to forgot password <a href='#' onClick={() => this.changeState('forgotPassword')}>Here</a>
      </Message>
      { error && <Message warning mt="3" text="left">{error}</Message> }
    </Grid.Column>
  </Grid>
    )
  }
}
