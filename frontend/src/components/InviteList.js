import React, { Component } from 'react'
import Group from './Group'
import { Button } from "semantic-ui-react";
import InviteReceived from './InviteReceived';
import InviteSent from './InviteSent';

export default class InviteList extends Component {
	constructor(props){
		super(props);
		this.state = {

		}
	}

	eachInvite(invite, i, access) {
		return (
			<InviteReceived  key={invite.id} from={invite.from_user} group={invite.group} invite={invite.id} access={access}>
		    </InviteReceived>
		)
	}

	inviteReceived(invite) {
		return invite.map((invite) => 
			<InviteReceived  key={invite.id} from={invite.from_user} group={invite.group} invite={invite.id} access={this.props.access}>
			</InviteReceived>
		)
	}

	inviteSent(invite) {
		return invite.map((invite) => 
			<InviteSent  key={invite.id} to={invite.to_user} group={invite.group} status={invite.status} invite={invite.id} access={this.props.access}>
			</InviteSent>
		)
	}

	chooseSentOrReceived(isSent, invite){
		if(isSent=="true"){
			return this.inviteSent(invite)
		}
		else {
			return this.inviteReceived(invite)
		}
	}

	render() {

		console.log(this.props.invite, this.props.isSent)
		return (
			<div>
				{this.chooseSentOrReceived(this.props.isSent, this.props.invite)}
			</div>
		);
	}
}