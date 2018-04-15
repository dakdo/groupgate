import React, { Component } from 'react'
import axios from 'axios';

export default class InviteReceived extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				Invite sent to <strong>{this.props.to_name}</strong> to join group <strong>{this.props.group_name}</strong> has status {this.props.status}
			</div>
		);
	}
}
