import React, { Component } from 'react'
import ReferenceListItem from './ReferenceListItem'
import { Button } from "semantic-ui-react";
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const url= `${BASE_URL}/api/referenceinfos`;

export default class ReferenceList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userId: this.props.userId,
			references: [],
			adding: false,
			addButtonDisabled: false
		}
		this.add = this.add.bind(this)
		this.eachRef = this.eachRef.bind(this)
		this.update = this.update.bind(this)
		this.remove = this.remove.bind(this)
		this.nextId = this.nextId.bind(this)
		this.onCancel = this.onCancel.bind(this)

	}

	componentDidMount(){
//		this.getRefs();
	}

/*
	getRefs(){																																	// API call to load Refs
		axios.get(`${url}?q={ "user_id": ${this.state.userId}" } `)
		.then(response => {
				this.setState( {courses: response.data}, () => {
					console.log('CL -> Trying to get Refs:', this.state.references);							/* DEBUG */
//				})
//		})
//	}

	add(text) {																																		// Add button clicked handler
		this.setState(prevState => ({
			references: [
				...prevState.references,
				{
					id: this.nextId(),
					ref_provider: '',																											// not finished
					ref_url: text,
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

	update( newText, i, addMode ) {
		console.log('updating item at index: ', i, newText)

		if ( addMode ){
/*			axios.request({
			method:'post',
			url:`http://localhost:3000/api/referenceinfos/`,
			data: {
				ref_provider: '',																								// not finished
				ref_url: newText,
				user_id: this.state.userId
			}
		}).then(response => {
			console.log( response )
		}).catch(err => console.log(err));
*/
		}

		this.setState(prevState => ({
			courses: prevState.courses.map(
				reference => (reference.id !== i) ? reference : {...reference, ref_provider: '',					// not finished
																													ref_url: newText }
			)
		}))

		this.setState({ addButtonDisabled: false })
	}

	onCancel( newState ){
		this.setState({ addButtonDisabled: newState })
	}

	remove(id) {
		console.log('removing item at', id)																					// DEBUG
		axios.delete(`http://localhost:3000/api/referenceinfos/${id}`)
      .then(response => {
        this.setState( {
          }, () => {
          console.log('MP -> Loading user: ', this.state);
        })
      })

		this.setState(prevState => ({
			courses: prevState.courses.filter(reference => reference.id !== id)
		}))
	}

	eachRef(reference, i) {
		console.log ('CL -> checking reference at eachRef: ', reference.course_number, '  ', reference.id, i)									// DEBUG
		return (
			<ReferenceListItem key={reference.id}
				  index={reference.id} label_1='Reference Provider: ' 																						// INCOMPLETE HERE
					provider= {reference.ref_provider} url= {reference.ref_url} adding={this.state.adding}
					onCancel={this.onCancel} onChange={this.update} onRemove={this.remove}>
				  {reference.ref_provider} {reference.ref_url}
		  </ReferenceListItem>
		)
	}

	render() {
		return (
			<div className="panel-group">
				<Button id="add" basic color="blue" onClick={this.add.bind(null,"")}
								disabled={this.state.addButtonDisabled}>+ Add Reference</Button>

				{this.state.references.map(this.eachRef)}
			</div>
		)
	}
}
