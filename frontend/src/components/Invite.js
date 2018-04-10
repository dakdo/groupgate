import React, { Component } from "react";
import axios from 'axios';
import { Button } from "semantic-ui-react";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

export default class InviteForm extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '3'};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    getAxiosHeaders(){
        return{
          headers: {
            'Content-Type' : `application/json`,
            Authorization: `JWT ${this.props.access.token}`
          }
        }
      }

    //TODO: should have a prop already containing user groups. Need a way to select a group
    sendInvite(user, group) {
        console.log("group chosen: " + group)
        var data = {
        from_user: this.props.access.user_id,
        to_user: user.id,
        group: group,
        status:0
        };

        console.log(data)
        axios.post(
            `http://localhost:8000/api/invites/`,
            data, this.getAxiosHeaders()
        ).then(response => {}).catch(err => console.log(err));

    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('Your favorite flavor is: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.sendInvite(this.props.user,this.state.value)}>
            {/* <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select a group" /> */}
            <select value={this.state.value} onChange={this.handleChange}>
                <option value="3">3</option>
                <option value="7">7</option>
                <option value="12">12</option>
                <option value="11">11</option>
            </select>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
  