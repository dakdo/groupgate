import React, { Component } from 'react'
import Course from './Course'
import { Button } from "semantic-ui-react";
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const url= `${BASE_URL}/api/courseinfos`;

const date = new Date();

export default class CourseList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			courses: [],
			adding: false,
			addButtonDisabled: false
		}
		this.add = this.add.bind(this)
		this.eachCourse = this.eachCourse.bind(this)
		this.update = this.update.bind(this)
		this.remove = this.remove.bind(this)
		this.nextId = this.nextId.bind(this)
		this.onCancel = this.onCancel.bind(this)
		this.getCurrentTermSemester = this.getCurrentTermSemester.bind(this)
	}

	componentDidMount(){
//		this.getCourses();
	}

/*
	getCourses(){																																	// API call to load courses
		axios.get(`${url}?q={ "user_id": ${this.state.userId}" } `)
		.then(response => {
				this.setState( {courses: response.data}, () => {
					console.log('CL -> Trying to get courses:', this.state.courses);							/* DEBUG */
//				})
//		})
//	}


	getCurrentTermSemester(){
		return (  (date.getMonth()+1) >= 1 && ((date.getMonth()+1) <= 4 ) ? 'Spring' :
			( ((date.getMonth()+1) >= 5 && (date.getMonth()+1) <= 8 ) ? 'Summer' : 'Fall' ) )
	}

	add(text) {																																		// Add button clicked handler
		this.setState(prevState => ({
			courses: [
				...prevState.courses,
				{
					id: this.nextId(),
					course_number: text,
					term_year: date.getFullYear(),
					term_semester: this.getCurrentTermSemester()
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
		// const dataPackage = newText;

		if ( addMode ){
			axios.request({																														//Add course
			method:'post',
			url:`http://localhost:3000/api/courseinfos/`,
			data: {
				course_number: newText,
				term_year: date.getFullYear(),
				term_semester: this.getCurrentTermSemester(),
				user_id: this.state.userId
			}
			}).then(response => {
				console.log(response )
			}).catch(err => console.log(err));

		}else {
			axios.request({																														// update course
				method:'patch',
				url:`http://localhost:3000/api/courseinfos/${i}`,
				data: { course_number: newText }
			}).then(response => {
			}).catch(err => console.log(err));
		}





		this.setState(prevState => ({
			courses: prevState.courses.map(
				course => (course.id !== i) ? course : {...course, course_number: newText,
																													term_year: date.getFullYear(),
																												term_semester: this.getCurrentTermSemester()  }
			)
		}))

		this.setState({ addButtonDisabled: false })
	}

	onCancel( newState ){
		this.setState({ addButtonDisabled: newState })
	}

	remove(id) {
		console.log('removing item at', id)																					// DEBUG
		axios.delete(`http://localhost:3000/api/courseinfos/${id}`)
      .then(response => {
        this.setState( {
          }, () => {
          console.log('MP -> Loading user: ', this.state);
        })
      })

		this.setState(prevState => ({
			courses: prevState.courses.filter(course => course.id !== id)
		}))
	}

	eachCourse(course, i) {
		console.log ('CL -> checking course at eachCourse: ', course.course_number, '  ', course.id, i)									// DEBUG
		return (
			<Course key={course.id}
				  index={course.id} label_1='Course Number: ' label_2='Term: '
					value_2= {course.term_year} value_3= {course.term_semester} adding={this.state.adding}
					onCancel={this.onCancel} onChange={this.update} onRemove={this.remove}>
				  {course.course_number}
		  </Course>
		)
	}

	render() {
		return (
			<div className="panel-group">
				<Button id="add" basic color="blue" onClick={this.add.bind(null,"")}
								disabled={this.state.addButtonDisabled}>+ Add Course</Button>

				{this.state.courses.map(this.eachCourse)}
			</div>
		)
	}
}
