
import { Link } from "react-router-dom"
// import SimplePeer from "simple-peer"
// import Peer from "simple-peer"
// import { io } from "socket.io-client"
import { Mycontext } from "../App";
import { useContext, useRef } from "react";
import React from "react";
import "cors"
import Peer from "peerjs";


export default function Call(){

    // const socket = io("http://localhost:8000")
   
    const localref =useRef()
    const remoteref = useRef()
    const[localstream,setLocalStream]= React.useState()
    // const[room,setRoom]= React.useState()
    const[initiator,setInitiator]= React.useState(false)
    
    const[jwt_token,setJwt_token]= React.useState(localStorage.getItem('token'))
    // const[peer,setPeer] =   React.useState(new Peer())
    // const[offer_store,setOffer_store] =   React.useState([])
    const [other,setOther]= React.useState()
    const peer = useRef(null)
    

   

     const {user}= useContext(Mycontext)

     
     React.useEffect(()=>{
        
         const peeri = new Peer(user.uid)
         peer.curre

        navigator.mediaDevices.getUserMedia({video:true,audio:true})
        .then(stream=>{
            // console.log(stream)
         setLocalStream(stream)
         localref.current.srcObject = stream
         localref.current.classList.add('smallFrame')
        })


    console.log('ok ok ok')
       fetch(`http://localhost:5000/check_rooms/${user.uid}`,
     {method:'GET',
      headers:{
   'Authorization':`Bearer ${jwt_token}`
    }}).then(res=>res.json())
    .then(data=>{
        console.log("called",data.initiator)
        setInitiator(data.initiator)
        if(!data.initiator){setOther(data.other)
        console.log('other',data.other)} 
        // socket.emit('join room',{room:data.room,user:user.uid})
        // const temppeer= new Peer({initiator:false,trickle:true,localstream})
        // setPeer(temppeer)
        setInitiator(data.initiator)
        console.log("initiator:",data.initiator)
        // if(!data.initiator)
        // { console.log('I am not initiator')
        //     const temppeer= new Peer({initiator:false,trickle:true,localstream})
        //     setPeer(temppeer)
        // }
    })     
     },[jwt_token])

       
   

      
     console.log(peer)

      if(!initiator)
      { console.log("stream",localstream)
        const caller= peer.call(other,localstream)
        console.log("calling",caller)
        console.log('caller',other)
        if(caller){
            console.log(caller)

            caller.on('stream', function(stream) {
                remoteref.current.srcObject = stream
    
                // `stream` is the MediaStream of the remote peer.
                // Here you'd add it to an HTML video/canvas element.
              });
        }
        

      }

      peer.on('connection',()=>{
        console.log("connected")
      })

      peer.on('close',()=>{
        console.log("closed")
      })

      peer.on('call', function(call) {
        // Answer the call, providing our mediaStream
        console.log("stream after called",localstream)
        call.answer(localstream);
        call.on('stream', function(stream) {
            remoteref.current.srcObject = stream
            // `stream` is the MediaStream of the remote peer.
            // Here you'd add it to an HTML video/canvas element.
          });
      })



      



    

//     if(initiator)
//     {   console.log('initiator')
//     //   setPeer( new Peer({initiator:true,trickle:true,localstream}))
//       peer=new Peer({initiator:true,trickle:true,localstream})
//     }
//     else{

//         console.log("not a initiator")
//     //    setPeer (new Peer({initiator:false,trickle:true,localstream}))
//     peer=new Peer({initiator:false,trickle:true,localstream})

//     }
//    console.log("peer",peer)
//     socket.on('new user joined',(socket_id)=>{
//         console.log(`user with socket id: ${socket_id} has joined`)
//         console.log("length:",offer_store.length)
//         for(let i=0;i<offer_store.length;i++) 
//         {socket.emit('offer send',offer_store[i])
//         console.log(offer_store[i])
//     }
//         console.log(peer)
       
//      })

//      peer.on('error',err=>console.error("peer er",err))
//      peer.on('close',()=>{
//         console.log("connection has been closed")
//      })

//      peer.on('signal',data=>{
//         console.log(data)
//        if(initiator) {
//         setOffer_store(offer=>{
//             let temp=offer
//             temp.push(data)
//             return temp
//         })    
//     console.log('offer store',offer_store)
//     } 
//        else  socket.emit('answer send',data)
//     })
     
//     socket.on("receive offer",data=>{
//         console.log("data received",data)
//         peer.signal(data)
//     })
    

//     socket.on('receive answer',data=>{
//         console.log("answer received",data)
//         peer.signal(data)
//     })
//      peer.on('stream',stream=>{
//         console.log('stream',stream)
//         remoteref.current.srcObject = stream
//     })


    // socket.on('receive answer',answer=>{
    //     console.log('answer received')
    //     console.log(peer)
    //     peer.signal(answer)
    // })
   
    //  peer.on('signal',data=>{
    //     console.log("data sent",data)
    //     socket.emit('data send',data)
        
    // })

    // peer.on('stream',stream=>{
    //     console.log('stream',stream)
    //     remoteref.current.srcObject = stream
    // })
  

    // socket.on('data received',data=>{
    //     console.log('data received',data)

    //     peer.signal(data)
    // })

    // socket.on('receive offer',data=>{
    //     const temppeer= new Peer({initiator:false,trickle:true,localstream})
    //    temppeer.signal(data)
    //    temppeer.on('signal',answer=>{
    //     socket.emit('answer send',answer)
    //    })
    //    setPeer(temppeer)
       
    // })





    return(
        <div>
        {/* <script src="https://unpkg.com/peerjs@1.3.2/dist/peerjs.min.js"></script> */}
        <div id="videos">
       <video className="video-player"  id="user-1" ref={localref} muted autoPlay playsInline></video>
       <video className="video-player" id="user-2" ref={remoteref}  autoPlay playsInline></video>
   </div>

   {/* <div id="controls">

       <div className="control-container" onClick={toggleCamera} id="camera-btn">
       <img src={process.env.PUBLIC_URL + '/icons/camera.png'} alt="camera" />

           
       </div>

       <div className="control-container" onClick={toggleMic} id="mic-btn">
      
       <img src={process.env.PUBLIC_URL + '/icons/mic.png'} alt="mic" />

         
       </div> */}

       {/* <Link to={"/home"}>
           <div className="control-container" id="leave-btn">
              
               <img src={process.env.PUBLIC_URL + '/icons/phone.png'} alt="finish" />
           </div>
       </Link>

   </div> */}
   </div>
    )
}