import React, { Component } from 'react'
import axios from 'axios';

export default class InviteReceived extends Component {
	constructor(props) {
		super(props)
		this.ESCAPE_KEY = 27;
		this.ENTER_KEY = 13;
		this.state = {

		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidUpdate() {
		var textArea
		if(this.state.editing) {
			textArea = this._newGroupName
			textArea.focus()
			textArea.select()
		}
	}

	handleChange(e){
		this.setState({select_value: e.target.value})
	}

	getAxiosHeaders(){
		return{
			headers: {
				'Content-Type' : `application/json`,
				Authorization: `JWT ${this.props.access.token}`
			}
		}
	}

	//TODO: should have a prop already containing user groups. Need a way to select a group
	sendInviteResponse(decision, invite) {
			var data = {
				response: decision
			};

			console.log(data)
			axios.post(
					`http://localhost:8000/api/invites/` + invite + `/response/`,
					data, this.getAxiosHeaders()
			).then(response => {}).catch(err => console.log(err));

	}
	


	render() {
		const divStyle = {
			marginBottom: '20px',
			marginTop: '20px'
		}
		return (
			<div style={divStyle}>
					
					Invite from user <strong>{this.props.from_name}</strong> to join group <strong>{this.props.group_name}</strong>
					
					<button className="ui green button right floated" onClick={() => {this.sendInviteResponse(true, this.props.invite)}} id="accept">Accept</button>
					<button className="ui red button right floated" onClick={() => {this.sendInviteResponse(false, this.props.invite)}} id="decline">Decline</button>
					
			</div>
		);
	}
}
