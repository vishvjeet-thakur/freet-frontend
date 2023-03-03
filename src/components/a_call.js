

import { Link } from "react-router-dom";
// import AgoraRTM from "../agora-rtm-sdk-1.5.1"
import { Mycontext } from "../App";
import { useContext, useRef } from "react";
import { io } from "socket.io-client";

import React from "react";
import "cors"

import { useState } from "react";
import { useEffect } from "react";
     
  
export default function Call(props){
// eslint-disable no-unused-expressions

    // let APP_ID = "14a0125f0f534fdab1fd7c9aecdfcca9"

    const{user} = useContext(Mycontext)
//     console.log("this ",user)
    const [jwt_token,setToken] = useState(localStorage.getItem('token'))
    const socket = io("http://localhost:8000")

    
//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
  
//     const [check,setCheck]=useState(0)
     
    const localref = useRef(null)
    const remoteref = useRef(null)
    const [room,setRoom ]= React.useState("")

    // ****************************************************************************************
    
    // let APP_ID = "14a0125f0f534fdab1fd7c9aecdfcca9"


// let token = null;
// let uid = String(Math.floor(Math.random() * 10000))

// let client;
// let channel;

// let queryString = window.location.search
// let urlParams = new URLSearchParams(queryString)
// let roomId = urlParams.get('room')

// if(!roomId){
//     window.location = 'lobby.html'
// }
   React.useEffect(()=>{
    console.log(user.uid)
    fetch(`http://localhost:5000/create_room/${user.uid}`,
     {method:'GET',
      headers:{
   'Authorization':`Bearer ${jwt_token}`
    }
}).then(res=>res.json())
    .then(res=>{
        console.log(res.room)
        setRoom(res.room)
        socket.emit('join room',{room:res.room,user:user.name})})
    .catch(err=>console.error(err))
    // setCheck(check=>check+1)
    // console.log("called",check)

    // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    //   .then(stream => {
    //     // setLocalStream(stream);
    //     console.log('effect localstream ',stream)
    //     if(localref.current)  { localref.current.srcObject = stream;
    //         console.log("localstream is set")
        
    //     }

    //   })
    //   .catch(error => console.log(error));

    //   localref.current.classList.add('smallFrame')

   },[])

let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}


let constraints = {
    video:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080},
    },
    audio:true
}

let init = async () => {
    console.log("a")
    // client = await AgoraRTM.createInstance(APP_ID)
    // await client.login({uid, token})

    // socket.emit('join room',{room:"test",user:"aka"})
    // await channel.join()
    // socket.emit('join room',{room:"test",user:"test name"})
    

    socket.on('new user joined',(socket_id)=>{
        handleUserJoined(socket_id)
        
    } )
    socket.on('left',socket_id=>{
        handleUserLeft()
    })
    socket.on('offer received',offer=>{
        createAnswer(offer)
    })
    socket.on('answer received',answer=>{
        addAnswer(answer)
    })
    // socket.on('MessageFromPeer', handleMessageFromPeer)

    // localStream = await navigator.mediaDevices.getUserMedia(constraints)
    // if(localref.current)  {localref.current.srcObject = localStream
    //     console.log("localstream is set")}

    // try {
    //     localStream = await navigator.mediaDevices.getUserMedia(constraints)
    //     document.getElementById('user-1').srcObject = localStream
    // } catch (error) {
    //     console.error('Failed to get user media:', error)
    // }
    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    
    document.getElementById('user-1').srcObject = localStream
    console.log(" init localstream",localStream)

}
 

let handleUserLeft =async () => {
    document.getElementById('user-2').style.display = 'none'
    document.getElementById('user-1').classList.remove('smallFrame')
   socket.emit('leave room')
   
   fetch(`http://localhost:5000/delete_room/${user.uid}`,
     {method:'GET',
      headers:{
   'Authorization':`Bearer ${jwt_token}`
    }
}).then(res=>res.json())
    .then(res=>{
        console.log(res.room)
        setRoom(res.room)
        console.log("new room created",res.room)
        socket.emit('join room',{room:res.room,user:user.name})})
    .catch(err=>console.error(err))

}

// let handleMessageFromPeer = async (message, MemberId) => {

//     message = JSON.parse(message.text)

//     // if(message.type === 'offer'){
//     //     createAnswer(MemberId, message.offer)
//     // }

//     if(message.type === 'answer'){
//         addAnswer(message.answer)
//     }

//     if(message.type === 'candidate'){
//         if(peerConnection){
//             peerConnection.addIceCandidate(message.candidate)
//             console.log("b",message.candidate)
//         }
//     }


// }

let handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel:', MemberId)
    createOffer()
}


let createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection(servers)
    console.log('c')
    remoteStream = new MediaStream()
    if(remoteStream.active) document.getElementById('user-2').srcObject = remoteStream

    console.log("create peer remotestream",remoteStream)
    // console.log("remotestream kind",remoteStream.kind)
    document.getElementById('user-2').style.display = 'block'
    document.getElementById('user-1').classList.add('smallFrame')
    
    // remoteref.current.srcObject = remoteStream
//    remoteref.current.style.display = 'block'

//     localref.current.classList.add('smallFrame')


    if(!localStream){
        localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
        // localref.current.srcObject = localStream
    console.log('create peer localstream',localStream)

        document.getElementById('user-1').srcObject = localStream

    }

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
        console.log('create peer track',track)
        console.log('create peer track localstream',localStream)
        console.log('create peer track remotestream',remoteStream)
    
    
    })

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
            console.log('on track',track)
            console.log('on track remotestream',remoteStream)
            console.log('on track localstream',localStream)
        
        })
       
        // console.log('e')
        // console.log(peerConnection)
        // // remoteref.current.srcObject = event.streams[0]
        // document.getElementById('user-2').srcObject = event.streams[0]
        // console.log("track added to the remote stream", document.getElementById('user-2').srcObject)
        // event.streams[0].getTracks().forEach((track) => {
        //     console.log("remote track added",track)
        //     remoteStream.addTrack(track)
        // })
    }

    peerConnection.onicecandidate = async (event) => {
        console.log('d')
        if(event.candidate){
            // client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
            socket.emit('ice candidate send',event.candidate)
        }
    }
}

let createOffer = async () => {
    console.log("offer created")
    console.log('f')
    await createPeerConnection()

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    // client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
    socket.emit('offer sent',offer)
    console.log("offer sent")
}


let createAnswer = async ( offer) => {
    console.log("answer created")
    console.log('g')
    await createPeerConnection()
    //  await peerConnection.setRemoteDescription(offer).then(async(done)=>{
    // await peerConnection.createAnswer().then(async(answer)=>{
    // await peerConnection.setLocalDescription(answer)
    await peerConnection.setRemoteDescription(offer)
    
    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    socket.emit('answer sent',answer)  
    console.log(answer)
    console.log('answer sent')


    // }).catch(err=>{
    //     console.error(er)
    // })
         
    //  })

    // // client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId)
    // }
    // else
    // {
    //     await createPeerConnection().then(async(con,err)=>{
    //     console.log("connection was not established to send answer")
    //         await peerConnection.setRemoteDescription(offer).then(async(done)=>{
    //             await peerConnection.createAnswer().then(async(answer)=>{
    //             await peerConnection.setLocalDescription(answer)
    //             socket.emit('answer sent',answer)  
    //             console.log(answer)
    //             console.log('answer sent')
            
            
    //             }).catch(err=>{
    //                 console.error(er)
    //             })
                     
    //              })
            

    //     })
    // }
    
}


let addAnswer = async (answer) => {
    console.log('h')
    console.log("answer received")
    if(peerConnection && !peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}


// let leaveChannel = async () => {
//     await channel.leave()
//     await client.logout()
// }

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

    if(videoTrack.enabled){
        videoTrack.enabled = false
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        videoTrack.enabled = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

let toggleMic = async () => {
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}
  
 window.addEventListener('beforeunload', leaveChannel)

 function leaveChannel(){
    socket.disconnect()
 }

// document.getElementById('camera-btn').addEventListener('click', toggleCamera)
// document.getElementById('mic-btn').addEventListener('click', toggleMic)

init()







   

// *******************************************************************************************************************************
//    React.useEffect(()=>{
//     console.log(user.uid)
//     fetch(`http://localhost:5000/create_room/${user.uid}`,
//      {method:'GET',
//       headers:{
//    'Authorization':`Bearer ${jwt_token}`
//     }
// }).then(res=>res.json())
//     .then(res=>{
//         console.log(res.room)
//         socket.emit('join room',{room:res.room,user:user.name})})
//     .catch(err=>console.error(err))
//     setCheck(check=>check+1)
//     console.log("called",check)

//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//       .then(stream => {
//         setLocalStream(stream);
//         localref.current.srcObject = stream;
//       })
//       .catch(error => console.log(error));

//       localref.current.classList.add('smallFrame')

//    },[jwt_token])



//    const handleRemoteStream = event => {
//     setRemoteStream(event.stream);
//     remoteref.current.srcObject = event.stream;
//   };
   

    
   
 
// //   const uid = user.uid
// //   console.log(user)
// // let token = null;


// // let client;
// // let channel;






// const servers = {
//     iceServers:[
//         {
//             urls:['stun:stun1.l.google.com:19302',
//             'stun:stun2.l.google.com:19302',
//                 'stun:stunserver.stunprotocol.org']
//         }
//     ]
// }

// let peerConnection
// // const [peerConnection, setPeerConnection] = useState(null);
// const [isLocalDescriptionSet, setIsLocalDescriptionSet] = useState(false);
// const [isRemoteDescriptionSet, setIsRemoteDescriptionSet] = useState(false);

// const [localDescription,setLocalDescriptionValue]=useState(null)
// const [remoteDescription,setRemoteDescriptionValue] = useState(null)

// const handleIceCandidate = (event) => {
//     console.log("ice candidate",event.candidate)
//   const iceCandidate = event.candidate;
//   if(iceCandidate==null)console.log("all ice candidates are gathered")
//   else socket.emit("ice candidate send",iceCandidate)
  
// };

// const createPeerConnection = () => {
//     console.log("create peer called")
//   peerConnection = new RTCPeerConnection(servers);
//   console.log("connection state",peerConnection.iceGatheringState)
 
// peerConnection.ontrack = handleRemoteStream

//   navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//   .then(localStream => {
//     // Add the local media stream to the peer connection
//     localStream.getTracks().forEach(track => {
//         if(peerConnection) {peerConnection.addTrack(track, localStream);
//             console.log("remote stream added")}
//     });
//   })
//   .catch(error => console.error("Failed to get user media: ", error));

//   peerConnection.onicecandidate = (event) => {
//     console.log("ice candidate",event.candidate)
//   const iceCandidate = event.candidate;
//   if(iceCandidate==null)console.log("all ice candidates are gathered")
//   else socket.emit("ice candidate send",iceCandidate)
  
// };
 
// //   setPeerConnection(newPeerConnection);
//   console.log("peerconnection",peerConnection)
// };

//  // peerConnection.onicecandidate = async (event) => {
//     //     if(event.candidate){
//     //         socket.emit("ice candidate send",event.candidate)
//     //     }
//     // }

// const setLocalDescription = async () => {
//   if(peerConnection){
//     await peerConnection.setLocalDescription(localDescription).then(res=>setIsLocalDescriptionSet(true));
//   }
// };

// const setRemoteDescription = async () => {
//     if(peerConnection){
//   await peerConnection.setRemoteDescription(remoteDescription).then(res=> setIsRemoteDescriptionSet(true));
//     }

// };

// useEffect(() => {
//     console.log("effect for peerconnection")
    
//   if (!peerConnection) {
//     createPeerConnection();
//   }
//   else{
//     console.log("not peer",peerConnection)
//   }
// }, [peerConnection]);

// useEffect(() => {
//   if (localDescription) {
//     setLocalDescription();
//   }
// }, [localDescription]);

// useEffect(() => {
//   if (remoteDescription) {
//     setRemoteDescription();
//   }
// }, [remoteDescription]);


// let constraints = {
//     video:{
//         width:{min:640, ideal:1920, max:1920},
//         height:{min:480, ideal:1080, max:1080},
//     },
//     audio:true
// }


//     socket.on('check message',()=>{
//         console.log("ramesh")
//     })

//      socket.on('new user joined',socket_id=>{
//         console.log("new user joined with socket_id:",socket_id)
//         createOffer()
//      })


//      socket.on('check',socket_id=>
//      {
//         console.log("another user joined with socket_id:",socket_id)
//      })


//      socket.on("offer received",async(offer)=>{
//         console.log("offer received",offer)
//         await peerConnection.setRemoteDescription(offer).then(res=>{setIsLocalDescriptionSet(true)
//         createAnswer(offer)

//         });

//      })

//      socket.on("answer received",answer=>{
//         console.log(answer)
//         addAnswer(answer)
//      })

//      socket.on("user left",()=>{
//         handleUserLeft()
//      })
  
//      socket.on("ice candidate received",(iceCandidate)=>{
//         console.log(iceCandidate)
//         if(peerConnection){
//             if (iceCandidate && isLocalDescriptionSet && isRemoteDescriptionSet) {
//                 peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
//                   .catch((error) => console.log(error));
//               }
//               else console.log("another problem")
//         }
                    

//      })



//     //  let handleUserJoined = async (MemberId) => {
//     //     console.log('A new user joined the channel:', MemberId)
        
       
//     // }



//     // client = await AgoraRTM.createInstance(APP_ID)
//     // await client.login({uid, token})
//     // console.log("init",roomId)
//     // channel = client.createChannel(roomId)
//     // await channel.join().then(createOffer(uid))

//     // channel.on('MemberJoined', handleUserJoined)
//     // channel.on('MemberLeft', handleUserLeft)
   
//     // client.on('MessageFromPeer', handleMessageFromPeer)
   
// // try {
// //     localStream = await navigator.mediaDevices.getUserMedia(constraints)
// //     if(localref.current) localref.current.srcObject = localStream
  
    
// // } catch (error) {
// //     console.error('Failed to get user media:', error)
// // }

// // if(localref.current) localref.current.srcObject = localStream



// // console.log(localStream)



 

// let handleUserLeft = () => {
//     remoteref.current.style.display = 'none'
//     localref.current.classList.remove('smallFrame')
// }


// // let handleMessageFromPeer = async (message, MemberId) => {

// //     message = JSON.parse(message.text)
// //     console.log("msg",message)

// //     if(message.type === 'offer'){
// //         console.log("offer")
// //         createAnswer(MemberId, message.offer)
// //     }

// //     if(message.type === 'answer'){
// //         console.log("answer")
// //         addAnswer(message.answer)
// //     }

// //     if(message.type === 'candidate'){
// //         console.log("ice candidate")
// //         if(peerConnection){
// //             peerConnection.addIceCandidate(message.candidate)
// //         }
// //     }


// // }




// // let createPeerConnec = async () => {
   
// //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
// //     .then(stream => {
// //       stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
// //       console.log("streamm is sending")
// //       return peerConnection.createOffer();
// //     }).then(offer => peerConnection.setLocalDescription(offer))
// //       .catch(error => console.log(error));

//     // remoteStream = new MediaStream()

//     // if(remoteref.current) 
//     // {remoteref.current.srcObject = remoteStream
//     // remoteref.current.style.display = 'block'}

    


//     // if(!localStream){
//     //     localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
//     //     if(localref.current) localref.current.srcObject = localStream

//     // }

//     // localStream.getTracks().forEach((track) => {
//     //     peerConnection.addTrack(track, localStream)
//     // })

//     // peerConnection.ontrack = (event) => {
//     //     event.streams[0].getTracks().forEach((track) => {
//     //         remoteStream.addTrack(track)
//     //     })
//     // }

   
// // }


// let createOffer = async () => {

//     console.log('a')
//     console.log(peerConnection)
//     if(!peerConnection) createPeerConnection()
//     if(peerConnection){
//   console.log("connection state",peerConnection.iceGatheringState)

//         console.log('b')
//     await peerConnection.createOffer().then(offer=>{
//         setLocalDescriptionValue(offer)
//     socket.emit("offer sent",offer)
//     console.log("offer  sent")
//     }).catch(err=>console.log("offer sent err:",err))
// }

// }


// let createAnswer = async (offer) => {

//     if(peerConnection){
//   console.log("connection state",peerConnection.iceGatheringState)

    
//     setRemoteDescriptionValue(offer)
//     await peerConnection.createAnswer().then(answer=>{setLocalDescriptionValue(answer)
//     socket.emit("answer sent",answer)
     
//     }).catch(err=>console.log("answer err",err))
// }
  


// }


// let addAnswer = async (answer) => {
//     if(peerConnection && !peerConnection.currentRemoteDescription){
//         setRemoteDescriptionValue(answer)
//     }
// }
 

// let leaveChannel = async () => {
//     await channel.leave()
//     await client.logout()
// } 
 
// let toggleCamera = async () => {
//     let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

//     if(videoTrack.enabled){
//         videoTrack.enabled = false
//         document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
//     }else{
//         videoTrack.enabled = true
//         document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
//     }
// }

// let toggleMic = async () => {
//     let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

//     if(audioTrack.enabled){
//         audioTrack.enabled = false
//         document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
//     }else{
//         audioTrack.enabled = true
//         document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
//     }
// }
  
// window.addEventListener('beforeunload', leaveChannel)








return(
    <div>
        
         <div id="videos">
        <video className="video-player"  id="user-1"  autoPlay playsInline></video>
        <video className="video-player" id="user-2"  autoPlay playsInline></video>
    </div>

    <div id="controls">

        <div className="control-container" onClick={toggleCamera} id="camera-btn">
        <img src={process.env.PUBLIC_URL + '/icons/camera.png'} alt="camera" />

            
        </div>

        <div className="control-container" onClick={toggleMic} id="mic-btn">
       
        <img src={process.env.PUBLIC_URL + '/icons/mic.png'} alt="mic" />

          
        </div>

        <Link to={"/home"}>
            <div className="control-container" id="leave-btn">
               
                <img src={process.env.PUBLIC_URL + '/icons/phone.png'} alt="finish" />
            </div>
        </Link>

    </div>
    </div>
)
}