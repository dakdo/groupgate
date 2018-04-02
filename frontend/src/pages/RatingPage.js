import React, { Component } from "react";
import axios from 'axios';
import Nav from '../components/Nav';
import { Button, Form, Select, Grid, TextArea } from "semantic-ui-react";

const options = [
  {key:'0', text: '0', value: 0},
  {key:'1', text: '1', value: 1},
  {key:'2', text: '2', value: 2},
  {key:'3', text: '3', value: 3},
  {key:'4', text: '4', value: 4},
  {key:'5', text: '5', value: 5},
]

export default class Rating extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div className="container">
      
          <div className="ui segment">
          <Grid centered columns={3}>
            <Grid.Column>
              <h2>Group Member Rating</h2>
              <h6>You are currently rating for <strong>Jessica C.</strong></h6>
              <br/>
          <Form className="ui form center">
            <Form.Field control={Select} label='Technical Skills' options={options} placeholder='-' width={6}/>
            <Form.Field control={Select} label='Problem Solving' options={options} placeholder='-' width={6} />
            <Form.Field control={Select} label='Communication' options={options} placeholder='-' width={6} />
            <Form.Field control={Select} label='Time Management' options={options} placeholder='-' width={6} />
            <Form.Field control={Select} label='Activity' options={options} placeholder='-' width={6} />
            <Form.Field control={TextArea} label='Comment' placeholder='Add more comments...' />
            <Form.Field control={Button}>Submit</Form.Field>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
      </div>
    );
  }
}
