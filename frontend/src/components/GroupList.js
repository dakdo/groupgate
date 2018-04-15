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
			addButtonDisabled: false
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
		if(this.props.myGroups){

		  axios.get( `http://localhost:8000/api/groups/?owner=${this.props.access.user_id}`,
									this.getAxiosHeaders() )
		    .then(response => {
        this.setState( {

		          groups: response.data
						}, () => { console.log('response.data: ', response.data)
											{console.log('state.groups', this.state.groups)}
		        })
		    })
		}	// GET LIST OF OTHER GROUPS
		else{
			axios.get(`${url}`, this.getAxiosHeaders())											// need to FIX to exclude groups of current user and theoretically DB admin
			.then(response => {
				this.setState( {groups: response.data}, () => {
				console.log("GL-> other groups: ", this.state.groups)
				})
			})
		}
  }
  //---------------------------------------------------------------------------
	add(text) {
		this.setState(prevState => ({
			groups: [
				...prevState.groups,
				{
						id: this.nextId(),
						name: text,
						course: text,
	          // status: "Open",
	          description: text,
						members: []
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
	update(newGroupName, newCourseNumber, newDescription, i, addMode) {
			console.log('GL->addMode: ', addMode)

			if ( addMode ){
				var userId = Number(this.props.access.user_id)
				var dataPackage = {
					name: newGroupName,
					description: newDescription,
					members: [],
					owner: this.props.access.user_id
				}

				console.log(dataPackage)
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
					group => (group.id !== i) ? group : {...group, name: newGroupName, course: newCourseNumber, /*status: newStatus, */ description: newDescription}
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
			return (
				<Group key={group.id}
					  index={group.id} groupName={group.name} courseNumber={group.course} /*status={group.status} */
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
