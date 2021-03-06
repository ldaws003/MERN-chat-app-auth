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
      this.state.socket.emit("chat message", {text: this.state.text, name: this.props.auth.user.name});
      this.setState({ text: "" })
   }
   
   render() {
      const { user } = this.props.auth;
      return (
         <div style={{ minHeight: "75vh" }} className="container">
            <div className="row">
               <div className="col s12 center-align">
                  <h4>
                     <b>Hey there,</b> {user.name.split(" ")[0]}
                     <p className="flow-text grey-text text-darken-1">
                        You are logged into a full-stack{" "}
                        <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
                     </p>
                  </h4>
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
            <div className="row">
               <div className="col s12"
                style={{
                  boxSizing: "border-box"
                }}>
                  <ul style={{
                     listStyle: "none",
                     backgroundColor: "#3d3d3d",
                     color: "white",
                     borderRadius: "5px",
                     minWidth: "300px",
                     minHeight: "250px",
                     maxHeight: "35vh",
                     padding: "10px",
                     margin: "0px",
                     boxSizing: "border-box",
                     overflowY: "auto",
                     overflowWrap: "break-word",
                     hyphens: "auto"
                  }}
                  className="btr-scroll">
                     { this.state.chatRoom.map((msg, i) => (<li key={msg + String(i)}><p><strong>{msg.name}</strong>: {msg.text}</p></li>)) }
                  </ul>
               </div>
            </div>
            <div className="row center-align">
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