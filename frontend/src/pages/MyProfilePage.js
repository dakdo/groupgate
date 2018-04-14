import React, { Component } from "react";
import axios from 'axios';
import EditableField from '../components/EditableField';
import EditableTextArea from '../components/EditableTextArea';
import InviteReceived from '../components/InviteReceived';
import CourseList from '../components/CourseList'
import ReferenceList from '../components/ReferenceList';
import Nav from '../components/Nav';
import '../css/style.css';

const BASE_URL = 'http://localhost:8000';
const url= `${BASE_URL}/api/`;

export default class MyProfile extends Component {

  constructor(props) {
    super(props)
      this.state = {
          firstName: '',
          lastName: '',
          displayName: '',
          aboutMe: '',
          invitations_sent: [],
          invitations_received: [],
      }
      this.update = this.update.bind(this);
      this.getAxiosHeaders = this.getAxiosHeaders.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }


  getAxiosHeaders(){
    return{
      headers: {
        'Content-Type' : `application/json`,
        Authorization: `JWT ${this.props.access.token}`
      }
    }
  }

  getUserInfo(){
    axios.get( `http://localhost:8000/api/users/${this.props.access.user_id}/`)
      .then(response => {
        this.setState( {
          id: response.data.id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          displayName: response.data.display_name,
          aboutMe: response.data.about_me,
          invitations_received: response.data.invitations_received,
          invitations_sent: response.data.invitations_sent
          }, () => {
        })
      })
  }

  update( param, newValue, i ){
    var dataPackage
    switch(param){
      case '1':                                          // update display name
        dataPackage = { display_name: newValue };
        this.setState( prevState => ({
          displayName: newValue
        }) );
      break;
      case '2':                                         // update about me
        dataPackage = { about_me: newValue };
        this.setState( prevState => ({
          aboutMe: newValue
        }) );
      break;

      default: console.log('nothing got updated')
    }

    axios.patch(
      `http://localhost:8000/api/users/${this.props.access.user_id}/`,
      dataPackage, this.getAxiosHeaders()
    ).then(response => {}).catch(err => console.log(err));

  }

  render() {
    return (

        <div>
          <div className="container fluid">

            <br/>


              {/*Display Name Section*/}
              <h5 className="ui dividing header">Display Name</h5>
              <EditableField label=""
                              value = {this.state.displayName}
                              onChange = {this.update.bind(this)} />

              {/*About Me Section*/}
              <h5 className="ui dividing header">About Me</h5>
              <EditableTextArea label=""
                                value = {this.state.aboutMe}
                                onChange = {this.update.bind(this)} />

              {/*Invite section*/}
              <h5 className="ui dividing header">Invitations Sent</h5>

              <h5 className="ui dividing header">Invitations Received</h5>
              <InviteReceived from="1" group="11" invite="10" access={this.props.access}/>
              {/*My References Section*/}
              <h5 className="ui dividing header">My Courses with Project Groups</h5>
              <CourseList userId = {this.state.id} />

              {/*My References Section*/}
              {/* <h5 className="ui dividing header">My Reference Profiles</h5>
              <ReferenceList userId = {this.state.id} /> */}

          </div>
      </div>
    );
  }
}

//   {this.state.references.map(this.eachReference)}
