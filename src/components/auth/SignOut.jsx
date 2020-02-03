import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('SignOut');

export default class SignOut extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    Auth.signOut()
      .then(() => logger.info('sign out success'))
      .catch(err => logger.info('sign out error', err));
  }

  render() {
    return (
      <Button
        inverted
        onClick={this.signOut}
      >
        Sign Out
      </Button>
    )
  }
}
