import React, { Component } from "react";
import Nav from '../components/Nav';
import GroupList from '../components/GroupList';

export default class ProjGroups extends Component {

  constructor() {
    super();
    this.state = {                            // might remove the state
      groups: [],
    };
  }

  render() {

    return (
      <div className="container fluid">
        <br/>
          {/*Your Groups Section*/}
          <h5 className="ui dividing header">Project Groups You Created</h5>
          <GroupList access={this.props.access} myGroups={true}/>

          {/*Other Users Groups Section*/}
          <h5 className="ui dividing header">Project Groups Other Users Created</h5>
          <GroupList access={this.props.access} myGroups={false}/>
      </div>
    );
  }
}
