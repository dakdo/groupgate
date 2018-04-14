import React, { Component } from 'react'
import axios from 'axios';

export default class InviteReceived extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<p>Invite sent to {this.props.to} to join group {this.props.group} has status {this.props.status}</p>
			</div>
		);
	}
}
