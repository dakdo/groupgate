import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Modal, Header, Icon } from "semantic-ui-react";


export default class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      open_modal: false,
      invited_modal: false
    };
    this.invite = this.invite.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openInvitedModal = this.openInvitedModal.bind(this);
    this.closeInvitedModal = this.closeInvitedModal.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({open_modal: newProps.open_modal});
  }

  ratingRender(user){
    if (user.num_of_votes>0){
      return (((user.total_r_skills+user.total_r_comm+user.total_r_psolving+user.total_r_timemngmt+user.total_r_activity)/5)/user.num_of_votes)
    }else{
      return ("No Rating")
    }
  }
  invite(id, invitee_name){
    this.openInvitedModal();
    axios.request({
      method:'post',
      url:`http://localhost:3000/api/invitations/`,
      data: {
        inviter_id: this.props.inviter_id,
        invitee_id: id,
        inviter_name: this.props.inviter_name,
        invitee_name: invitee_name,
        status: "Pending"
      }
    }).then(response => {
      console.log(response )
    }).catch(err => console.log(err));
  }
    openModal(){
      this.setState({open_modal: true});
    }
  closeModal(){
    this.setState({open_modal: false});
  }
  openInvitedModal(){
    this.setState({invited_modal: true});
  }
  closeInvitedModal(){
    this.setState({invited_modal: false});
    this.setState({open_modal: false});
  }
  render(){
    return(
      <div className="card" href={`/otherUsers/${this.state.user.id}`}>
        <div className="content">
          <div className="header"><Link to={`/otherUsers/${this.state.user.id}`} >{this.state.user.display_name}</Link></div>
        </div>
        <div className="content">
          Total Score (%): {this.ratingRender(this.state.user)}
        </div>
        <div className="content">
          {this.state.user.num_of_votes} Vote(s)
        </div>
        <button className="ui bottom attached button" onClick={this.openModal}>
          + Invite
        </button>
        {/*Show confirmation modal when invite button clicked*/}
        <Modal style={{width: 600, padding: 100}} open={this.state.open_modal} className="scrolling" basic size='small'>
          <Header icon='warning circle' />
          <Modal.Content>
            <p>Are you sure you want to invite {this.state.user.display_name} to your group?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' /> No
            </Button>
            <Button color='green' inverted onClick={()=>this.invite(this.state.user.id, this.state.user.display_name)}>
              <Icon name='checkmark' /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
        {/*Show invitation sent modal*/}
        <Modal
          style={{width: 600, padding: 100}}
          className="scrolling"
          open={this.state.invited_modal}
          basic
          size='small'
          >
            <Header icon='browser' content='Invitation' />
            <Modal.Content>
              <h3>Your Invitation is sent!</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick={this.closeInvitedModal} inverted>
                <Icon name='checkmark' /> Got it
              </Button>
            </Modal.Actions>
          </Modal>
      </div>
      )}
    }
