import React, { Component } from "react";
import axios from 'axios';
import { Button } from "semantic-ui-react";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

export default class InviteForm extends Component {
    constructor(props) {
      super(props);
      this.state = '1';
  
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
        var data = {
          from_user: this.props.access.user_id,
          to_user: user.id,
          group: group,
          status:0
        };

        axios.post(
            `http://localhost:8000/api/invites/`,
            data, this.getAxiosHeaders()
        ).then(response => {}).catch(err => console.log(err));

    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      this.sendInvite(this.props.user,this.state.value)
      event.preventDefault();
    }
  
    createSelectItems(group_info) {
        var options = []

        for (var i=0; i < group_info.length; i++){
          options.push([group_info[i].group_id, group_info[i].group_name])
        } 
        
        let items = []    
        for (let i = 0; i < options.length; i++) {           
            console.log(options[i])
  
             items.push(<option value={options[i][0]}>{options[i][1]}</option>);   
             //here I will be creating my options dynamically based on
             //what props are currently passed to the parent component
        }
        return items;
    }  

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <select value={this.state.value} onChange={this.handleChange}>
                {this.createSelectItems(this.props.options)}
            </select>
          <input type="submit" value="Invite" />
        </form>
      );
    }
  }
  