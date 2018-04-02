import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { Button } from "semantic-ui-react";
//import OtherUser from '../components/OtherUser';

const userId = '5ab93f5262a8ef074012e04a';    // you have to update this user ID with id from your backend
const baseUrl = "http://localhost:8000/api/";
export default class OtherUsers extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      users: [],
      myinfo: {}
    };
    this.getOtherUsers = this.getOtherUsers.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.getMyInfo = this.getMyInfo.bind(this);
  }
  componentDidMount() {
    this.getOtherUsers();
    this.getMyInfo();
  }

  getMyInfo() {
    axios.get(`http://localhost:8000/api/users/${this.props.access.user_id}`)
      .then(response => {
        this.setState( {
          myinfo: response.data
          })
        console.log(this.state.myinfo)
      })
      console.log("line 35")
  }

  getOtherUsers(){
    axios.get("http://localhost:3000/api/users/")
      .then(response => {
        this.setState( {
          users: response.data,
          }, () => {
          console.log('OUP -> getOtherUsers: ',this.state.users);
        })
      })
  }

  //TODO: should have a prop already containing user groups. Need a way to select a group
  sendInvite(user) {
    if (this.state.myinfo.groups.length < 1) {
      alert("You currently don't belong to any group!");
      return;
    }
    var data = {
      from_user: this.props.access.user_id,
      to_user: user.id,
      group: this.state.myinfo.groups[0],
      status:0
       };
     var instance = axios.create({
        baseURL: "http://localhost:3000/api/",
        headers: {'Access-Control-Allow-Headers': 'Authorization',
                  'Authorization': `JWT ${this.props.access.token}`}
     });
   
   instance.post('invites/',data)
   .then(response => {
    alert("invited user to your first group")
    }).catch(err => console.log(err));
  }

  ratingRender(user){
    if (user.num_of_votes>0){
      return (<td>{((user.total_r_skills+user.total_r_comm+user.total_r_psolving+user.total_r_timemngmt+user.total_r_activity)/5)/user.num_of_votes}</td>)
    }else{
      return (<td>No Rating</td>)
    }
  }

  render() {
    return (

      <div className=" container fluid">
          <Nav />
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
                    <td><Button basic color="blue" onClick={()=>this.sendInvite(user)}>Invite</Button></td>
                  </tr>
                )
              })}
            </tbody>

          </table>
      </div>
    );
  }
}
