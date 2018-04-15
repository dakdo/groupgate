import React, { Component } from 'react'
import Group from './Group'
import { Button } from "semantic-ui-react";
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const url= `${BASE_URL}/api/groups/`;

export default class ProjectGroup extends Component {
	constructor(props){
    super(props);
    this.state = {
			adding: false,
			groups: [],
			addButtonDisabled: false,
    }
		this.add = this.add.bind(this)
		this.eachGroup = this.eachGroup.bind(this)
		this.update = this.update.bind(this)
		this.remove = this.remove.bind(this)
		this.nextId = this.nextId.bind(this)
		this.onCancel = this.onCancel.bind(this)
		this.getGroups = this.getGroups.bind(this)
		this.myGroupsButton = this.myGroupsButton.bind(this)
		//this.displayGroups = this.displayGroups.bind(this)
		this.getAxiosHeaders = this.getAxiosHeaders.bind(this)
	}
	//---------------------------------------------------------------------------
	getAxiosHeaders(){
		return{
			headers: {
				'Content-Type' : `application/json`,
				Authorization: `JWT ${this.props.access.token}`
			}
		}
	}

	componentDidMount() {
    this.getGroups();
  }

	getGroups(){
		// GET LIST OF MY GROUPS
			var group_set = []
			axios.get( `http://localhost:8000/api/memberships/?member=${this.props.access.user_id}`,this.getAxiosHeaders()).then(response => {
				console.log("MEMBERSHIP DATA", response.data)

				for(var i=0; i<response.data.length; i++){
					axios.get( `http://localhost:8000/api/groups/${response.data[i].group_id}`,this.getAxiosHeaders())
					.then(new_response => {
						console.log("GROUPS DATA", new_response.data)
						group_set.push(new_response.data)
						this.setState({groups: group_set})
					})
				}
			})
			console.log("GROUP SET", group_set)
			this.setState({groups: group_set})
		
	// GET LIST OF OTHER GROUPS
		// else{
		// 	axios.get(`${url}`, this.getAxiosHeaders())											// need to FIX to exclude groups of current user and theoretically DB admin
		// 	.then(response => {
		// 		this.setState( {groups: response.data}, () => {
		// 		console.log("GL-> other groups: ", this.state.groups)
		// 		})
		// 	})
		// }
  }
  //---------------------------------------------------------------------------
	add(text) {
		this.setState(prevState => ({
			groups: [
				...prevState.groups,
				{
						id: this.nextId(),
						name: text,
	          // status: "Open",
	          description: text,
						members: [],
						owner: this.props.access.user_id
					}
				],
			}))
			this.setState({adding: true})
			this.setState({ addButtonDisabled: true })
	}
	//---------------------------------------------------------------------------
	nextId() {
		this.uniqueId = this.uniqueId || 0
		return this.uniqueId++
	}
	//---------------------------------------------------------------------------
	// TODO: add status property in /api/groups/
	update(newGroupName, newDescription, i, addMode) {
			console.log('GL->addMode: ', addMode)

			if ( addMode ){
				var userId = Number(this.props.access.user_id)
				var dataPackage = {
					name: newGroupName,
					description: newDescription,
					members: [],
					owner: this.props.access.user_id
				}
				axios.post(`http://localhost:8000/api/groups/`,					//ADD GROUP
					dataPackage, this.getAxiosHeaders()
				).then(response => {}).catch(err => console.log(err));

			}else {
				console.log('addMode: ', addMode)

				var dataPackage = {
					name: newGroupName,
					description: newDescription,
					members: []
				}

				axios.patch(`http://localhost:8000/api/groups/${i}/`,					//UPDATE GROUP
					dataPackage, this.getAxiosHeaders()
				).then(response => {}).catch(err => console.log(err));

			}

			this.setState(prevState => ({
				groups: prevState.groups.map(
					group => (group.id !== i) ? group : {...group, name: newGroupName, description: newDescription}
				)
			}))

			this.setState({ addButtonDisabled: false })

	}

	//---------------------------------------------------------------------------
	onCancel( newState ){
		this.setState({ addButtonDisabled: newState })
	}
	//---------------------------------------------------------------------------
	remove(id) {
		console.log('removing item at', id)																					// DEBUG
		axios.delete(`http://localhost:8000/api/groups/${id}`, this.getAxiosHeaders() )
				.then(response => {
					this.setState( {
						}, () => {
						console.log('MP -> Loading user: ', this.state);
					})
			})

			this.setState(prevState => ({
				groups: prevState.groups.filter(group => group.id !== id)
			}))
		}
	//---------------------------------------------------------------------------
	eachGroup(group, i) {
			console.log("WHAT GROUP", group)
			return (
				<Group key={group.id}
					  index={group.id} groupName={group.name} courseNumber={group.course}
						description= {group.description} members={group.members} adding={this.state.adding} access={this.props.access}
						onCancel={this.onCancel} onChange={this.update} onRemove={this.remove} myGroups={this.props.myGroups}>
			  </Group>
			)
	}
	//---------------------------------------------------------------------------
	myGroupsButton(){
				if( this.props.myGroups ){
					return (
						<span>
							<Button basic color="blue" onClick={this.add.bind(null,"")} id="add"
														disabled={this.state.addButtonDisabled}>+ New Group</Button>
						</span>
					)
				}
	}
/*
		displayGroups(){
			if( this.state.groups.length > 0 ){
				return(
					<span>{this.state.groups.map(this.eachGroup) }</span>
				)
			}
		}

			{this.displayGroups()} {this.state.groups.map(this.eachGroup) }

*/
	//---------------------------------------------------------------------------
	render() {
			console.log('GL->state.groups before render:', this.state.groups)
			return(
				<div className="board">
					{this.myGroupsButton()}
					{this.state.groups.map(this.eachGroup) }
				</div>
			)
	}
}
