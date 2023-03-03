import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import React from 'react';
import 'cors'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


export default function Call() {
  const navigate  = useNavigate()
  
  const socket = io("https://freet-socket.onrender.com")

  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [check,setCheck] = useState(0)
  const[jwt_token,setJwt_token]= React.useState(localStorage.getItem('token'))
  const[other,setOther] = React.useState()
  const[initiator,setInitiator]=React.useState(false)
  const[newConnection,setNewConnection] = React.useState(0)

  const[caller,setCaller]= React.useState()
  const[stream,setStream]= React.useState()
  const[rooms,setrooms]= React.useState()
  
  
  useEffect(() => {
  //   let count=1
  //   if(newConnection!=0){
  //     count=2}
  // console.log('count',count)
    // for(let i=0;i<count;i++)
    // {
    const peer = new Peer();

    peer.on('open', (id) => {

      fetch(`https://freet-backend.onrender.com/check_rooms/${id}`,
     {method:'GET',
      headers:{
   'Authorization':`Bearer ${jwt_token}`
    }}).then(res=>res.json())
    .then(data=>{
      console.log(`${id} inserted`)
        if(!data.initiator){setOther(data.other)
          calls(data.other)
        console.log('other',data.other)} 
      if(data.room){ 
        setrooms(data.room)
        socket.emit('join room',{room:data.room})}
    }) 
    });

   

    // peer.on('close',()=>{
    //   console.log('disconnected')
    //   remoteVideoRef.current.style.display = 'none'
    //   currentUserVideoRef.current.classList.remove('smallFrame')
    //   setNewConnection(c=>c+1)

    // })

   

    peer.on('call', (call) => {
    setCaller(call)

      call.on('close',()=>{
        console.log('ss',stream)
        console.log("it worked")
        setNewConnection(c=>c+1)
       })

      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   currentUserVideoRef.current.classList.add('smallFrame')
   remoteVideoRef.current.style.display = 'block'

      
      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          setStream(remoteStream)
          console.log(remoteStream)
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  // }
  
  }, [newConnection])

  socket.on('left',()=>{
    console.log('user disconnected')
    setNewConnection(c=>c+1)
     caller.close()
  })



  if(stream)
  {console.log('stream',stream)
  stream.addEventListener('inactive',()=>{
    console.log('it wokkkkk')
    // setNewConnection(c=>c+1)
  })
   
  }

  if(caller){
    caller.on('close',()=>{
      console.log("ok here it is working")
    })
  }

  const calls = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   remoteVideoRef.current.style.display = 'block'

   currentUserVideoRef.current.classList.add('smallFrame')

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)
     setCaller(call)
    
     call.on('close',()=>{
      console.log("it worked")
      setNewConnection(c=>c+1)
     })
      call.on('stream', (remoteStream) => {
        setStream(remoteStream)

        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

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

function leaveChannel(){
  console.log("disconnected leave channel")
console.log(caller)
// caller.close()
socket.emit('leave room',{room:rooms})
}
  
window.addEventListener('beforeunload', leaveChannel)

// document.getElementById('camera-btn').addEventListener('click', toggleCamera)
// document.getElementById('mic-btn').addEventListener('click', toggleMic)

  return (
    <div>
    <div id="videos">
   <video className="video-player" ref={currentUserVideoRef} id="user-1" autoplay playsinline></video>
   <video className="video-player" ref={remoteVideoRef} id="user-2" autoplay playsinline></video>
</div>

<div id="controls">

   <div className="control-container" onClick={toggleCamera} id="camera-btn">
       <img src="icons/camera.png" />
   </div>

   <div className="control-container"  onClick={toggleMic} id="mic-btn">
       <img src="icons/mic.png" />
   </div>
   
   <div className="control-container" onClick={leaveChannel} id="leave-btn">
           <img src="icons/phone.png" />
       </div>
   {/* <Link to="/home">
       <div className="control-container" id="leave-btn">
           <img src="icons/phone.png" />
       </div>
   </Link> */}

</div>

</div>
  );
}

