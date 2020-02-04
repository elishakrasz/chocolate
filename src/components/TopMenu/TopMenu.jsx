import React, { Component } from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import TopSearch from './TopSearch';
import MyMenu from './MyMenu';
import Notification from '../Notification/Notification';
import { Logger } from 'aws-amplify';
import store from '../../store';
import SignOut from '../auth/SignOut'
import './TopMenu.css';

const logger = new Logger('TopMenu');
class TopMenu extends Component {
    constructor(props) {
        super(props);
    
        this.storeListener = this.storeListener.bind(this);
    
        this.state = { user: null, profile: null, activeItem: 'inbox' }
      }
//   state = { activeItem: 'inbox', user: null, profile: null  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  componentDidMount() {
    this.unsubscribeStore = store.subscribe(this.storeListener);
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  storeListener() {
    logger.info('redux notification');
    const state = store.getState();
    this.setState({ user: state.user, profile: state.profile });
  }

  render() {
    const { user, activeItem } = this.state;
    const profile = this.state.profile || {};

     if(!user) {
       return (
         null
       )
     }

    let iconStyle = {
      margin: '0 10px 0 0'
    };

    return (
      <Menu pointing secondary className="top-menu">
        <Menu.Menu postion="left" className="menu-logo">
          <Menu.Item>
            <a to="dashboard">Ginzi</a>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu className="center menu">
          <Menu.Item
            name="home"
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
          >
            <Icon name="home" size="large" style={iconStyle} />
            <span>Home</span>
          </Menu.Item>

          {/* <Menu.Item
            name="browser"
            active={activeItem === 'browser'}
            onClick={this.handleItemClick}
          >
            <Icon name="line chart" size="large" style={iconStyle} />
            <span>Data</span>
          </Menu.Item>

          <Menu.Item
            name="portfolio"
            active={activeItem === 'portfolio'}
            onClick={this.handleItemClick}
          >
            <Icon name="cubes" size="large" style={iconStyle} />
            <span>Portfolio</span>
            <Dropdown>
              <Dropdown.Menu>
                <Dropdown.Header>Categories</Dropdown.Header>
                <Dropdown.Item>Home Goods</Dropdown.Item>
                <Dropdown.Item>Bedroom</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Order</Dropdown.Header>
                <Dropdown.Item>Status</Dropdown.Item>
                <Dropdown.Item>Cancellations</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item> */}
        </Menu.Menu>

        <Menu.Menu position="right">
          <Menu.Item>
            <TopSearch />
          </Menu.Item>
          <Menu.Item name="notification" onClick={this.handleItemClick}>
            <Notification icon="alarm" numOfNew={3} />
          </Menu.Item>
          {/* <Menu.Item name="message" onClick={this.handleItemClick}>
            <Icon name="comments outline" size="large" style={iconStyle} />
          </Menu.Item> */}
          
          <Menu.Item>
          { user? 'Hi ' + (profile.given_name || user.username) : 'Please sign in' }
          </Menu.Item>
          { user && <SignOut /> }
          <Menu.Item name="setting" onClick={this.handleItemClick}>
            <MyMenu />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

// { user? 'Hi ' + (profile.given_name || user.username) : 'Please sign in' }
//           </Navbar.Text>
//           { user && <SignOut /> }
export default TopMenu;
