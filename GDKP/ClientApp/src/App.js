import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Counter } from './components/Counter';
import { RaidData } from './components/RaidData';
import { RoutePaths } from './components/RoutePaths';
import { RaidRecord } from './components/RaidRecord';
import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
            <Route path='/counter' component={Counter} />
        <Route exact path={RoutePaths.Raid} component={RaidRecord} />
            <Route exact path='/raid-data' component={RaidData} />
      </Layout>
    );
  }
}
