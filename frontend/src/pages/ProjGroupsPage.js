import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const url= `${BASE_URL}/api/projgroups`;

export default class ProjGroups extends Component {

  constructor() {
    super();
    this.state = {
      groups: []
    };
  }

  componentWillMount() {
    this.getProjGroups();
  }

  getProjGroups(){
    axios.get(url)
      .then(response => {
        this.setState( {groups: response.data}, () => {
          console.log(this.state)
        })
    })
  }




  render() {

    const {groups} = this.state;

    return (
      <div>
        <Nav />

        <p>Components for 'Project Groups' page go here.</p>

        { groups.map((group, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title"><span className="btn">Group: { group.group_name }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p>Description: { group.group_descr } </p>
                  </div>
                </div>
              </div>
          ))}



      </div>
    );
  }
}
