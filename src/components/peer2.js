// import { useEffect, useRef } from "react"
// import { useState,useContext } from "react"
// import { Mycontext } from "../App"

// export default function call(){

//         const {user} = useContext(Mycontext)


//         useEffect(()=>{

//             fetch(`http://localhost:5000/check_rooms/${user.uid}`,{
//                 method:'GET',
//                 headers:{

//                 }

//             })

//         },[])





//     return (
//          {/* <script src="https://unpkg.com/peerjs@1.3.2/dist/peerjs.min.js"></script> */}
//          <div id="videos">
//          <video className="video-player"  id="user-1" ref={localref} muted autoPlay playsInline></video>
//          <video className="video-player" id="user-2" ref={remoteref}  autoPlay playsInline></video>
//      </div>
  
//      {/* <div id="controls">
  
//          <div className="control-container" onClick={toggleCamera} id="camera-btn">
//          <img src={process.env.PUBLIC_URL + '/icons/camera.png'} alt="camera" />
  
             
//          </div>
  
//          <div className="control-container" onClick={toggleMic} id="mic-btn">
        
//          <img src={process.env.PUBLIC_URL + '/icons/mic.png'} alt="mic" />
  
           
//          </div> */}
  
//          {/* <Link to={"/home"}>
//              <div className="control-container" id="leave-btn">
                
//                  <img src={process.env.PUBLIC_URL + '/icons/phone.png'} alt="finish" />
//              </div>
//          </Link>
  
//      </div> */}
//      </div>
//     )
// }