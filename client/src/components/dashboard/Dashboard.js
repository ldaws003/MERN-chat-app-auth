import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
//import io from "../../../../node_modules/socket.io/socket.io.js";
import io from "socket.io-client";


class Dashboard extends Component {
   constructor(props){
      super(props);
      this.state = {
         text: "",
         socket: io("http://localhost:5000"),
         chatRoom: []
      };
      this.onLogoutClick = this.onLogoutClick.bind(this);
      this.onSubmit = this.onSubmit.bind(this); 
      this.onChange = this.onChange.bind(this);
   }
   
   onLogoutClick = e => {
      e.preventDefault();
      this.props.logoutUser();
   };
   
   onChange(e) {
      this.setState({ text: e.target.value });
   }
   
   componentDidMount() {
      this.state.socket.on("chat message", (msg) => {
         this.setState({ chatRoom: [...this.state.chatRoom, msg] })
      });
   }
   
   onSubmit(e){
      e.preventDefault();
      if (!this.state.text) {
         // tell user to put in text
         return;
      }
      this.state.socket.emit("chat message", this.state.text);
      this.setState({ text: "" })
   }
   
   render() {
      const { user } = this.props.auth;      
      return (
         <div style={{ height: "75vh" }} className="container valign-wrapper">
            <div className="row">
               <div className="col s12 center-align">
                  <h4>
                     <b>Hey there,</b> {user.name.split(" ")[0]}
                     <p className="flow-text grey-text text-darken-1">
                        You are logged into a full-stack{" "}
                        <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
                     </p>
                  </h4>
                  {this.state.chatRoom.map((msg, i) => (<li key={msg + String(i)}><p>{msg}</p></li>))}
                  <form 
                     onSubmit={this.onSubmit}
                     className="col s12">
                     <div className="row">
                        <div className="input-field col s12">
                           <textarea 
                              id="send-msg-text" 
                              className="materialize-textarea" 
                              placeholder="Say something..."
                              onChange={this.onChange}
                              value={this.state.text}/>
                           <label htmlFor="send-msg-text" className="">Message</label> 
                        </div>
                        <input  
                         type="submit"
                         style={{
                           borderRadius: "3px",
                           letterSpacing: "1.5px",
                           marginTop: "1rem"  
                         }}
                         className="btn waves-effect waves-light hoverable green accent-3"
                         value="Send Message"/>
                     </div>
                  </form>
                  <button
                     style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                     }}
                     onClick={this.onLogoutClick}
                     className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                     Logout
                  </button>
               </div>
            </div>
         </div>
      );
   }
}

Dashboard.propTypes = {
   logoutUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(
   mapStateToProps,
   { logoutUser }
)(Dashboard);