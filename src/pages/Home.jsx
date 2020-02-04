import React, { Component } from 'react';
import { Container } from 'semantic-ui-react'
import Login from './Login'

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;

    if (!user) { return <Login /> }

    return (
      <React.Fragment>
        <Container>
        Home
        </Container>
      </React.Fragment>
    )
  }
}
