import React, { Component } from "react";
import axios from 'axios';
import EditableField from '../components/EditableField';
import EditableTextArea from '../components/EditableTextArea';
import CourseList from '../components/CourseList'
import ReferenceList from '../components/ReferenceList';
import Nav from '../components/Nav';
import '../css/style.css';

const BASE_URL = 'http://localhost:3000';
const url= `${BASE_URL}/api/userinfos`;

  const userId = '5ab93f5262a8ef074012e04a';    // DEV: you have to update this user ID with id from your backend
                                                // 5ab877baf628341800003765   //restdb.io

export default class MyProfile extends Component {

  constructor(props) {
    super(props)
      this.state = {
          token: '',
          id: '',
          displayName: '',
          aboutMe: '',
      }
      this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
    console.log("my token is: ", this.props.accessToken)
    this.setState({
      token: this.props.accessToken
    })
  }

  getUserInfo(){
    axios.get(`http://localhost:3000/api/userinfos/${userId}`)
      .then(response => {
        this.setState( {
          id: response.data.id,
          displayName: response.data.display_name,
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
              <CourseList userId = {userId} />

              {/*My References Section*/}
              <h5 className="ui dividing header">My Reference Profiles</h5>
              <ReferenceList userId = {userId} />

          </div>
      </div>
    );
  }
}

//   {this.state.references.map(this.eachReference)}
