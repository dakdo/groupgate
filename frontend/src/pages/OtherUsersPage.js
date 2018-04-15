import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { Button } from "semantic-ui-react";
//import OtherUser from '../components/OtherUser';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import InviteForm from '../components/Invite';

const baseUrl = "http://localhost:8000/api";
export default class OtherUsers extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      users: [],
      myinfo: {}
    };
    this.getOtherUsers = this.getOtherUsers.bind(this);
    this.getAxiosHeaders = this.getAxiosHeaders.bind(this)
    this.getMyInfo = this.getMyInfo.bind(this);
  }
  componentDidMount() {
    this.getMyInfo()
    this.getOtherUsers()
  }

  getAxiosHeaders(){
    return{
      headers: {
        'Content-Type' : `application/json`,
        Authorization: `JWT ${this.props.access.token}`
      }
    }
  }

  getMyInfo() {
    axios.get(`${baseUrl}/users/${this.props.access.user_id}/`)
      .then(response => {
        this.setState( {
          myinfo: response.data
          })
      })
  }

  getOtherUsers(){
    axios.get("http://localhost:8000/api/users/")
      .then(response => {
        this.setState( {
          users: response.data,
          }, () => {
          console.log('OUP -> getOtherUsers: ',this.state.users);
        })
      })
  }



  ratingRender(user){
    if (user.num_of_votes>0){
      return (<td>{((user.total_r_skills+user.total_r_comm+user.total_r_psolving+user.total_r_timemngmt+user.total_r_activity)/5)/user.num_of_votes}</td>)
    }else{
      return (<td>No Rating</td>)
    }
  }

  
  render() {
    var options = []
    var defaultOption = 0
    const group_info = this.state.myinfo.groups
    if(typeof group_info!=="undefined") {
      if(group_info.length > 0) {
        for (var i=0; i < group_info.length; i++){
          options.push(group_info[i].group_id)
        }
        defaultOption = options[0]
        console.log(options)
      }
    }
    // console.log("My info: " + JSON.stringify(group_info))


    // console.log("My info: " + JSON.stringify(options))
    return (
      
      <div className=" container fluid">
          <br/>
          <table className="ui very basic table">
            <thead>
              <tr>
                <th>Display Name</th>
                <th className="three wide">Total Score (%)</th>
                <th className="three wide"># of Ratings</th>
                <th></th>
              </tr>
            </thead>
            <tbody>

              {this.state.users.map((user,i)=>{

                return(
                  <tr key={i}>
                    <td><Link to={`/otherUsers/${user.id}`} >{user.username}</Link></td>
                    {this.ratingRender(user)}
                    <td>{user.num_of_votes}</td>
                    <td><InviteForm options={this.state.myinfo.groups} access={this.props.access} user={user}/></td>
                  </tr>
                )
              })}
            </tbody>

          </table>
      </div>
    );
  }
}
