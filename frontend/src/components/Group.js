import React, { Component } from 'react'
import { Button } from "semantic-ui-react";
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const url= `${BASE_URL}/api/groups/`;

export default class Group extends Component {
	constructor(props) {
		super(props)
		this.ESCAPE_KEY = 27;
		this.ENTER_KEY = 13;
		this.state = {
			select_value: this.props.status,
			adding: props.adding,
			editing: false,
			addButtonDisabled: props.addButtonDisabled
		}
		this.edit = this.edit.bind(this)
		this.remove = this.remove.bind(this)
		this.save = this.save.bind(this)
		this.cancel = this.cancel.bind(this)
		this.renderForm = this.renderForm.bind(this)
		this.renderDisplay = this.renderDisplay.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.displayButtons = this.displayButtons.bind(this)
	}

	componentDidUpdate() {
		var textArea
		if(this.state.editing) {
			textArea = this._newGroupName
			textArea.focus()
			textArea.select()
		}
	}

	getAxiosHeaders(){
		return{
			headers: {
				'Content-Type' : `application/json`,
				Authorization: `JWT ${this.props.access.token}`
			}
		}
	}

	edit() {
		this.setState({
			editing: true,
			adding: false
		})
	}

	remove() {
		this.props.onRemove(this.props.index)
	}

	save(e) {
		e.preventDefault()
		console.log('Group, adding flag: ', this.state.adding)
		this.props.onChange(this._newGroupName.value, this._newDescription.value, this.props.index, this.state.adding)
		this.setState({
			editing: false
		})
		this.setState({adding: false})
	}

	displayMembers(members) {
		const divStyle = {
			marginBottom: '20px',
			marginTop: '20px'
		}

		const otherDivStyle = {
			marginLeft: '25px'
		}

		const members_now = members.map((member) => 
			<li>
				<div style={divStyle}>
					Name: {member.user_display_name} | Role: {member.user_role}
					<button className="ui red button right small" onClick={() => {this.deleteMember(members, member)}}>X</button>
				</div>
			</li>
		)
		return members_now
	}
	deleteMember(members, deletemember) {
		var new_members = []
		for(var i = 0; i<members.length; i++){
			if(members[i].user_id != deletemember.user_id){
				new_members.push({"user_id": members[i].user_id, "user_role": members[i].user_role})
			}
		}
		var data = {
			members: new_members
		}
		axios.patch(`http://localhost:8000/api/groups/${this.props.index}/`,					//UPDATE GROUP
			data, this.getAxiosHeaders()
		).then(response => {}).catch(err => console.log(err));
	}

	cancel = (e) => {
		if(this.state.adding){					// fixes the difference between Editing new record and editing existing record
				this.remove()
		}

    this.setState({
			editing: false
		})
		this.props.onCancel( false )
	}

	handleChange(e){
		this.setState({select_value: e.target.value})
	}
//Edit Form Render
	renderForm() {
		return (
			<div className="ui clearing segment">
			<div className="note" style={this.style}>
				<form className="ui form">

					{"Group Name:"}
					<div className="five wide field">
					<input type="text" ref={input => this._newGroupName = input}
							  defaultValue={this.props.groupName}/>
					</div>

					{"Description:"}
					<div className="ten wide field">
					<textarea ref={input => this._newDescription = input}
								defaultValue={this.props.description}/>
					</div>
					<button className="ui primary button right floated" id="save" onClick={this.save}>Save</button>
					<button className="ui red button right floated" id="cancel" onClick={this.cancel}>Cancel</button>
				</form>
			</div>
			</div>
		)
	}
//Normal Render


displayButtons(){

		if( this.props.myGroups ){
			return (
				<span>
					<button className="ui primary button right floated" onClick={this.edit} id="edit">Edit</button>
					<button  className="ui red button right floated" onClick={this.remove} id="remove">Remove</button>
				</span>
			)
		}
}


	renderDisplay() {
		return (
      <table className="ui single line basic table">
        <thead>
          <tr>
            <th className="two wide">{"Group Name"}</th>
            <th>{"Description"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.props.groupName}</td>
            <td>{this.props.description}</td>
          </tr>
					<tr>
						<td>{"Group Members: "} 
							<ul>
								{this.displayMembers(this.props.members)}
							</ul>
					  </td>

					</tr>
          <tr>
            <td colSpan="4">
								{this.displayButtons()}
      			</td>
    </tr>
      </tbody>
    </table>
		)
	}
	render() {
		return this.state.editing || this.state.adding ? this.renderForm() : this.renderDisplay()
	}
}
