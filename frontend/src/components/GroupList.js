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
			userId: this.props.userId,
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
		console.log("GL-> myGroups: ", this.props.myGroups)

		let axiosConfig = {
      headers: {
        'Content-Type' : `application/json`,
        Authorization: `JWT ${this.props.access.token}`
      }
    }

		// GET LIST OF MY GROUPS  - REPLACE WITH CALL TO groups
		if(this.props.myGroups){
/*
			axios.get( `http://localhost:8000/api/groups?owner_id=${this.props.access.user_id}/`,
			this.getAxiosHeaders() )
	      .then(response => {
	        this.setState( {
	          id: response.data.id,
	          groups: response.data.groups,
	          }, () => {
	        })
	      })
*/


}				// GET LIST OF OTHER GROUPS
		else{
			axios.get(`${url}`, this.getAxiosHeaders())
			.then(response => {
				this.setState( {groups: response.data}, () => {
				console.log(this.state)
				})
			})
		}
  }

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

		nextId() {
			this.uniqueId = this.uniqueId || 0
			return this.uniqueId++
		}

		update(newGroupName, newCourseNumber, newStatus, newDescription, i, addMode) {

			if ( addMode ){																														// update group
				var userId = Number(this.props.access.user_id)
				var dataPackage = {
					name: newGroupName,
					course: newCourseNumber,
					description: newDescription,
					members: [],
					owner: userId
				}

				axios.post(`http://localhost:8000/api/groups/`,
					dataPackage, this.getAxiosHeaders()
				).then(response => {}).catch(err => console.log(err));

			}else {
				axios.request({
					method:'patch',
					url:`http://localhost:8000/api/groups/${i}`,
					data: {
						name: newGroupName,
						description: newDescription,
						//status: newStatus,
						course: newCourseNumber																				// items will need to be udpated when adding/removing members enabled
					}
				}).then(response => {
				}).catch(err => console.log(err));
			}

			this.setState(prevState => ({
				groups: prevState.groups.map(
					group => (group.id !== i) ? group : {...group, name: newGroupName, course: newCourseNumber, /*status: newStatus, */ description: newDescription}
				)
			}))

			this.setState({ addButtonDisabled: false })
		}

		onCancel( newState ){
			this.setState({ addButtonDisabled: newState })
		}

		remove(id) {
			console.log('removing item at', id)																					// DEBUG
			axios.delete(`http://localhost:8000/api/groups/${id}`)
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

		eachGroup(group, i) {
			console.log("GL -> goup members at i: ", i,  group.members)
			return (
				<Group key={group.id}
					  index={group.id} groupName={group.name} courseNumber={group.course} /*status={group.status} */
						description= {group.description} members={group.members} adding={this.state.adding}
						onCancel={this.onCancel} onChange={this.update} onRemove={this.remove} myGroups={this.props.myGroups}>
			  </Group>
			)
		}

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

			{this.displayGroups()}
*/
		render() {
			return(
				<div className="board">
				{this.state.groups.map(this.eachGroup) }
				</div>
			)
		}
	}
