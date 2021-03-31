import React, { Component } from "react";
import { render } from "react-dom";
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, NavLink  } from 'reactstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      current : 1,
      max : 1,
      placeholder: "Loading"
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  fetchData() {
    fetch("test-task-backend/v2/?developer=a&page="+this.state.current)
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
       return response.json();
       
      })
      .then(result => {
        console.log(JSON.stringify(result));
        this.setState(() => {
            return {
                data:result.message.tasks,
                current:result.current,
                max:Math.floor(((parseInt(result.total_task_count)%3==0)?0:1)+parseInt(result.total_task_count)/3),
                loaded: true
              };
        });
    })
    }


  componentDidMount() {
    this.fetchData();
  }
 
  handlePrev() { this.setState(state => (
      {current:Math.max(1,state.current-1)}), this.fetchData);
    };
  handleNext() { this.setState(state => (
      {current:Math.min(state.max,state.current+1)}), this.fetchData);
    };

    renderButton1 () {
            return <Col><Button onClick={this.handlePrev}>Prev Page</Button></Col>
    }

    renderButton2 () {
            return <Col><Button onClick={this.handleNext}>Next Page</Button></Col>
      }

  render() {
        console.log(JSON.stringify(this.state));

      return (
        <div className="app flex-row align-items-center">
        <Container>
            <Row>Tasks</Row>
            <Row>Page {this.state.current} </Row>
            {
                this.state.data.map(task => {
                  return (
                    <Row key={task.id}>
                        <Col>{task.text}
                        </Col>
                        <Col>
                        {task.username}
                     </Col>
                    </Row>
                  );
                })
            }
            <Row>{this.renderButton1()}</Row>
            <Row>{this.renderButton2()}</Row>
            </Container>
        </div>
        
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);