import React, { Component } from "react";
import axios from 'axios';
import EditableField from '../components/EditableField';
import EditableTextArea from '../components/EditableTextArea';
import CourseList from '../components/CourseList'
import ReferenceList from '../components/ReferenceList';
import Nav from '../components/Nav';
import '../css/style.css';

// const BASE_URL = 'http://localhost:3000';
// const url= `${BASE_URL}/api/userinfos`;

  //const userId = '5ab93f5262a8ef074012e04a';    // DEV: you have to update this user ID with id from your backend
                                                // 5ab877baf628341800003765   //restdb.io

export default class MyProfile extends Component {

  constructor(props) {
    super(props)
      this.state = {
          token: this.props.access.token,
          id: this.props.access.user_id,
          firstName: '',
          lastName: '',
          displayName: '',
          aboutMe: '',
      }
      this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo(){

    console.log("MP -> id used for APi call: ", this.props.access.user_id)
/
    axios.get( `http://localhost:8000/api/users/${this.props.access.user_id}/`, { "Content-Type": "application/json" } )
      .then(response => {
        this.setState( {
          id: response.data.id,
          displayName: response.data.first_name,                                    // justt testing, change to display name later
          aboutMe: response.data.about_me,
          }, () => {
          console.log('MP -> Loading user: ', this.state);
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


    axios.request({
      method:'patch',
      url:`http://localhost:3000/api/userinfos/${this.state.id}`,
      data: dataPackage
    }).then(response => {
    }).catch(err => console.log(err));


  }

  render() {
    return (

        <div>
          <div className="container fluid">

            <Nav />
            <br/>
             <h5 className="ui dividing header">Display Token</h5>
              <EditableField label=""
                              value = {this.state.token}
                              onChange = {this.update.bind(this)} />

              <h5 className="ui dividing header">record id</h5>
              <EditableField label=""
                              value = {this.state.id}
                              onChange = {this.update.bind(this)} />

              <h5 className="ui dividing header">First Name</h5>
              <EditableField label=""
                              value = {this.state.firstName}
                              onChange = {this.update.bind(this)} />


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

              {/*My References Section*/}
              <h5 className="ui dividing header">My Courses with Project Groups</h5>
              <CourseList userId = {this.state.id} />

              {/*My References Section*/}
              <h5 className="ui dividing header">My Reference Profiles</h5>
              <ReferenceList userId = {this.state.id} />

          </div>
      </div>
    );
  }
}

//   {this.state.references.map(this.eachReference)}
