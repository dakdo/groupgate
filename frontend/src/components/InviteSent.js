import React, { Component } from 'react'
import axios from 'axios';

export default class InviteReceived extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: ''
		}
	}

	showStatus() {
		var status = ""
		if(this.props.status==0){
			status = "Pending"
		}
		else if(this.props.status==1){
			status = "Accepted"
		}
		else{
			status = "Declined"
		}
		return status
	}
	render() {
		return (
			<div>
				Invite sent to <strong>{this.props.to_name}</strong> to join group <strong>{this.props.group_name}</strong> has status <strong>{this.showStatus()}</strong>
			</div>
		);
	}
}
