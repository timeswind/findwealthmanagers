// import React, { Component } from 'react';
// import {push} from 'react-router-redux';
// import FontIcon from 'material-ui/FontIcon';
// import {connect} from 'react-redux';
//
// class DashboardEmailVerifiedSection extends Component {
//   render () {
//     const { emailVerified, verifyEmailStatus } = this.props
//     return (
//       <div>
//         { emailVerified === false ? (
//           <div className="flex-row flex-center default-padding raleway" style={{
//               marginBottom: "16px",
//               backgroundColor: "#fff",
//               border: "1px solid #FF9800",
//               color: "#FF9800"
//             }}>
//             <span>Your email is not varified</span>
//             { verifyEmailStatus === 'pending' ? (
//               <CircularProgress size={0.5}/>
//             ) : (
//               <div style={{marginLeft: "auto"}}>
//                 {verifyEmailStatus === 'sent' ? (
//                   <span>Email sent</span>
//                 ) : (
//                   <FlatButton
//                     label="verify now"
//                     style={{marginLeft: "auto", color: "rgb(255, 152, 0)"}}
//                     onClick={() => {
//                       this.verifyEmail()
//                     }}
//                     />
//                 )}
//               </div>
//             ) }
//           </div>
//         ) : null }
//       </div>
//     )
//   }
// }
// export default connect()(DashboardEmailVerifiedSection);
