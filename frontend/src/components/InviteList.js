import React, { Component } from 'react'
import Group from './Group'
import { Button } from "semantic-ui-react";
import InviteReceived from './InviteReceived';

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

	render() {

		console.log(this.props.invite)
		return (
			<div>
				{this.props.invite.map((invite) => 
					
					<InviteReceived  key={invite.id} from={invite.from_user} group={invite.group} invite={invite.id} access={this.props.access}>
					</InviteReceived>
				)}
			</div>
		);
	}
}