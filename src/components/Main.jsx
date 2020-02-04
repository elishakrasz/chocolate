import React, { Component } from 'react';
// import { Container } from 'bootstrap-4-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Logger } from 'aws-amplify';

import store from '../store';
import { Home, Profile, Login } from '../pages';
import LeftMenu from './LeftMenu/LeftMenu';
import MainContainer from './MainContainer/MainContainer';

const logger = new Logger('Main');

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.storeListener = this.storeListener.bind(this);

    this.state = { user: null }
  }

  componentDidMount() {
    this.unsubscribeStore = store.subscribe(this.storeListener);
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  storeListener() {
    logger.info('redux notification');
    this.setState({ user: store.getState().user });
  }

  render() {
    const { user } = this.state;

    if (!user) { return <Login /> }
    return (
        <div>
          <HashRouter>
            <Switch>
            {/* <Route
                exact
                path="/login"
                render={(props) => <Login user={user} />}
              /> */}
              <LeftMenu />
              <MainContainer>
              <Route component={({ match }) =>
              <div>
                     <Route
                exact
                path="/"
                render={(props) => <Home user={user} />}
              />
              <Route
                exact
                path="/profile"
                render={(props) => <Profile user={user} />}
              />
              </div>
            }/>
              </MainContainer>
            </Switch>
          </HashRouter>
        </div>
    )
  }
}
