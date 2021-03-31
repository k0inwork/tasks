import Modal from "./Modal";

import React, { Component } from "react";
import { render } from "react-dom";
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, NavLink  } from 'reactstrap';


const api_url = "test-task-backend/v2/";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      
      loaded: false,
      
      //paging
      current : 1,
      max : 1,
      
      // status line
      placeholder: "",

      // sorting
      sorting : "",
      order : "asc",
      
      // logged in
      username:"",
      password:"",
      logged_in:0,
      token:"",

      // login window
      login_open:false,

      // add window
      add_open:false,
      add_username:"",
      add_email:"",
      add_text:"",

      //edit window
      edit_open:false,
      edit_text:"",
      edit_id:"",
      edit_status:"",
      edit_email:"",
      edit_username:"",
      edit_enabled:false



    };

    this.close_window=this.close_window.bind(this);
    this.open_window=this.open_window.bind(this);
    this.addRecord=this.addRecord.bind(this);
    this.logIn=this.logIn.bind(this);
    this.logOut=this.logOut.bind(this);
    this.edit=this.edit.bind(this);
  }

  loginData() {
    
    const requeststring = api_url+"login";

    const options = {
      method:'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
}),      
      body: "username="+this.state.username+"&password="+this.state.password
    }

    fetch (requeststring,options)
    .then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
     return response.json();
     
    })
    .then((json)=>{
      if (json.status == "ok")
          this.setState(state=>{
            return {
              logged_in : 1,
              token : json.token,
              placeholder : "Logged In"
            }
          }); 
      else
        this.setState(state=>{
          return {
            logged_in : 0,
            token :"",
            placeholder : "Login Failed."+(json.message?JSON.stringify(json.message):"")
          }
        }); 
    })
  }
  
  addRecordData() {
    
    const requeststring = api_url+"create";

    const options = {
      method:'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
}),      
      body: "developer=aa&username="+this.state.add_username+
            "&email="+this.state.add_email+
            "&text="+this.state.add_text
    }

    fetch (requeststring,options)
    .then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
     return response.json();
     
    })
    .then((json)=>{
      if (json.status == "ok")
          this.setState(state=>{
            return {
              placeholder : "Item Added."
            }
          },this.fetchData); 
      else
        this.setState(state=>{
          return {
            placeholder : "Creation failed."+(json.message?JSON.stringify(json.message):"")
          }
        }); 
    })
  }


  fetchData() {
    let requeststring = api_url+"?developer=a&page="+this.state.current;
    if (this.state.sorting != "") 
      requeststring += "&sort_field="+this.state.sorting+"&sort_direction="+this.state.order;

    fetch(requeststring)
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

    editData() {
      const requeststring = api_url+"edit/:"+this.state.edit_id;

      let status = this.state.edit_status;
      if (this.state.edit_status && (this.state.edit_status).toString().startsWith("C")) //'Choose status'
        status=null;
      
      const text = this.state.edit_text;

      const tosend = "token="+this.state.token+"&text="+text+(status==null?"":"&status="+status);

      const options = {
        method:'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
  }),      
        body: "developer=aa&"+tosend
      }
  
      fetch (requeststring,options)
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
       return response.json();
       
      })
      .then((json)=>{
        if (json.status == "ok")
            this.setState(state=>{
              return {
                placeholder : "Item modified."
              }
            },this.fetchData); 
        else
          this.setState(state=>{
            return {
              placeholder : "Edit failed."+(json.message?JSON.stringify(json.message):"")
            }
          }); 
      })
  
      }
  
  
  componentDidMount() {
    this.fetchData();
  }

  logOut() {
    const windows = ['edit','add','login']
    for (const w of windows) {
      this.close_window(w);
    }

    this.setState( state =>( 
      { logged_in: 0, token:"" }));
  }

  logIn() {
    this.close_window('login');//close window
    this.loginData();
  }

  addRecord() {
    this.close_window('add');
    this.addRecordData();

  }

  edit() {
    this.close_window('edit')

    this.editData();

    this.setState(()=>(
      {edit_enabled:false}
    )
    );
  }

  setSorting(sort) {
    this.setState( state =>( 
      { sorting: sort }), this.fetchData);
  }

  changeOrder() {
    this.setState( state =>( 
      { order: state.order=="asc"?"desc":"asc" }), this.fetchData);
  }
 
  handlePrev() { this.setState(state => (
      {current:Math.max(1,state.current-1)}), this.fetchData);
    };
  handleNext() { this.setState(state => (
      {current:Math.min(state.max,state.current+1)}), this.fetchData);
    };

    renderButton1 () {
      return <button className="btn btn-secondary" disabled={this.state.current==1?"dsiabled":null} onClick={this.handlePrev.bind(this)}>Prev</button>;
    }

    renderButton2 () {
      return <button className="btn btn-secondary" disabled={this.state.current==this.state.max?"disabled":null} onClick={this.handleNext.bind(this)}>Next</button>
    }

    renderButtonAdd () {
      return 1 && 
          <button className="btn btn-secondary" onClick={()=>this.open_window("add")}>Add
          </button>
    }

    renderButtonLogin () {
      return this.state.logged_in == 0 && 
          <button onClick={()=>this.open_window("login")} 
            className="btn btn-secondary toggle-button"> Log In
          </button>
  }


  renderUserName(username,id,status,email,text) {
    return (this.state.logged_in == 1 &&
    <a href="" onClick={()=>{
      this.setState(()=>(
        {
          edit_email:email,
          edit_text:text,
          edit_id:id,
          edit_username:username,
          edit_status:status,
          edit_enabled:true
        }
      ))
      
      event.preventDefault();
    }}>{username}</a> )
    || (this.state.logged_in == 0 &&
          <span>{username}</span>
    )
  }

  renderTaskStatus(status) {
    switch (status) {
      case 0: return "Unfinished"
      case 1: return "Unfinished. Edited"
      case 10: return "Finished"
      case 11: return "Finished. Edited"
    }
  }

  renderButtonLogout () {
    return this.state.logged_in == 1 &&
      <button onClick={this.logOut} 
        className="btn btn-secondary"> Log Out  
      </button>
}

  renderButtonEdit () {
    return this.state.logged_in == 1 &&
      <button onClick={()=>this.open_window('edit')} 
        disabled={this.state.edit_enabled?null:"disabled"} className="btn btn-secondary">Edit  
      </button>
  }

close_window(window) {
  this.setState(state=>({[window+'_open']:0}))
}

open_window(window) {
  if (this.state[window+'_open'])
    this.close_window(window);
  else {
    const windows = ['edit','add','login']
    for (const w of windows) {
      this.close_window(w)
    }
    this.setState(state=>({[window+'_open']:1}))
  }

}

render() {
        console.log(JSON.stringify(this.state));

      
      return (
        <div className="app flex-row align-items-center">
        <Container>
            <Row><Col className="col-12"><h3>Tasks</h3></Col></Row>
            <Row><Col className="col-12"><p className="text-center">Page {this.state.current}</p></Col> </Row>
            <table id="example" className="table table-striped table-bordered">
            <thead>
            <tr className="d-flex">
              <th className="col-3" onClick = {()=>{this.setSorting("username");this.changeOrder()}}>Username</th>
              <th className="col-3" onClick = {()=>{this.setSorting("email");this.changeOrder()}}>E-mail</th>
              <th className="col-4" onClick = {()=>{this.setSorting("text");this.changeOrder()}}>Text</th>
              <th className="col-2" onClick = {()=>{this.setSorting("status");this.changeOrder()}}>Status</th>
            </tr></thead>
            <tbody>
            {
                this.state.data.map(task => {
                  return (
                    <tr className="d-flex" key={task.id}>
                      <td className="col-3" >
                        {this.renderUserName(task.username,task.id,task.status,task.email,task.text)}
                      </td>
                      <td className="col-3" >
                        {task.email}
                      </td>
                      <td className="col-4">
                        {task.text}
                      </td>
                      <td className="col-2">
                        {this.renderTaskStatus(task.status)}
                     </td>
                    </tr>
                  );
                })
            }
            </tbody>
            </table>
            <Row><Col className="col-12"><span> <hr/> </span></Col></Row>

            <Row >
              <Col className="col-4">
                {this.renderButton1()}
                {this.renderButton2()}
              </Col>
            <Col className="col-3">{this.renderButtonAdd()}</Col>
            <Col className="col-4">
              {this.renderButtonLogin()}
              {this.renderButtonLogout()}
              {this.renderButtonEdit()}
            </Col>
            </Row>
            <Row className="fixed-bottom">
              <Col>{this.state.placeholder}</Col>
            </Row>
            </Container>

            <Container>
              <Row>
                <Col className="col-3"></Col>
                <Col className="col-6">
                 <Modal show={this.state.login_open} >
            <form>
            <div class="form-group">
              <label htmlFor="exampleUser1">Username </label>
              <input type="input" value={this.state.username} className="form-control" 
                id="exampleUser1"  placeholder="Enter username" 
                onChange={(e)=>{this.setState({username:e.target.value})}} />
            </div>
            <div class="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" value={this.state.password} className="form-control"
               id="exampleInputPassword1" placeholder="Password"
               onChange={(e)=>{this.setState({password:e.target.value})}} />
            </div>
            <button  type="button" className="btn btn-primary" onClick={()=>this.logIn()}>Submit</button>
            </form>
            </Modal>

            <Modal show={this.state.add_open} >
            <form>
            <div class="form-group">
              <label htmlFor="addUsername">Username</label>
              <input type="input" value={this.state.add_username} className="form-control" 
                id="addUsername"  placeholder="Enter username" 
                onChange={(e)=>{this.setState({add_username:e.target.value})}} />
            </div>
            <div class="form-group">
              <label htmlFor="addEmail">Email</label>
              <input type="input" value={this.state.add_email} className="form-control" 
                id="addEmail"  placeholder="Enter email" 
                onChange={(e)=>{this.setState({add_email:e.target.value})}} />
            </div>
            <div class="form-group">
              <label htmlFor="addText">Text</label>
              <input type="input" value={this.state.add_text} className="form-control" 
                id="addText"  placeholder="Enter text" 
                onChange={(e)=>{this.setState({add_text:e.target.value})}} />
            </div>
            <button  type="button" className="btn btn-primary" onClick={()=>this.addRecord()}>Submit</button>
            </form>
            </Modal>

            <Modal show={this.state.edit_open} >
            <form>
            <div class="form-floating">
              <label htmlFor="editUsername">Username</label><p/>
              <label className="form-control" id="editUsername">{this.state.edit_username}</label>
            </div>
            <div class="form-group">
              <label htmlFor="editEmail">Email</label><p/>
              <label  className="form-control" id="editEmail">{this.state.edit_email}</label>
            </div>
            <div class="form-group">
              <label htmlFor="editText">Text</label>
              <input type="input" value={this.state.edit_text} className="form-control" 
                id="editText"  placeholder="Change text" 
                onChange={(e)=>{this.setState({edit_text:e.target.value})}} />
            </div>
            <div class="form-group">
              <label htmlFor="editStatus">Status</label>
              <select type="select" value={this.state.edit_status} className="form-select" 
                id="editStatus"  placeholder="Change status" 
                onChange={(e)=>{this.setState({edit_status:e.target.value})}} >
                <option selected>Choose status</option>
                <option value="0">Unfinished</option>
                <option value="10">Finished</option>
                </select>
            </div>
            <button  type="button" className="btn btn-primary" onClick={()=>this.edit()}>Submit</button>
            </form>
            </Modal>
                </Col>
                <Col className="col-3"></Col>
              </Row>
            </Container>

        </div>
    )
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);