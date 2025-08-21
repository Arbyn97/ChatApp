
import { useEffect,useState } from "react";
import { useSocket,useSession } from "../Requierment/MyContext";
import {  BsTrash} from "react-icons/bs";

function ClientSide() {
    
    const [message,setMessage]=useState([])
    const [text,setText]=useState('')
    
    // const socketRef = useRef(null);

const roomId = useSession();

    const socket=useSocket()
    console.log("Socket is:", socket);
    
    
    useEffect(()=>
      {

        
         if (!socket) return;
    // socketRef.current = io('http://localhost:4000');
        
      
    //      socketRef.current.emit('recived', 'i want all datas');
    //     socketRef.current.on('all messages', (msg) => {
    //   setMessage(msg);
    // });


    // وارد شدن به روم
    socket.emit("join room", roomId);

      socket.emit('recived',{roomId});
        socket.on('all messages', (msg) => {
      setMessage(msg);
     
      
    });


    // شنیدن پیام جدید
    // socketRef.current.on('message', (msg) => {
    //   setMessage(prev => [...prev, msg]);
    // });
      socket.on('message', (msg) => {
      setMessage(prev => [...prev, msg]);
    });

    // پاکسازی هنگام unmount
    // return () => {
    //   socketRef.current.off('all messages');
    //   socketRef.current.off('message');
    //   socketRef.current.disconnect();
    // };
     return () => {
      socket.off('all messages');
      socket.off('message');
     
    };
    },[socket,roomId]);
   
    const Send=(e)=>
      {
      
       e.preventDefault()
      
       if (text.trim() === '') return; // جلوگیری از ارسال پیام خالی
       socket.emit('message',{roomId,message:text} );
       setText('')
         
      }
   
 if (!socket) {
    return <div>⏳ در حال اتصال به سرور چت...</div>;
  }
  const hndleDelete=async (e,id)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:4000/api/delete',{
         method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:id }),
      })
      

      if (response.ok) {
  setMessage(prev => prev.filter(m => m._id !== id));

      } else {
       console.log('a problem')
      }
    }
    catch{ console.log('some problem')}
  }
  // const hndleEdite =async(e,id,text)=>{
  //   e.preventDefault();
  //   try{
  //     const response=await fetch('http://localhost:4000/api/edit',{
  //        method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({id:id ,text:text}),
  //     })
      

  //     if (response.ok) {
  // console.log('edited')

  //     } else {
  //      console.log('a problem')
  //     }
  //   }
  //   catch{ console.log('some problem')}

  // }
    return ( 
       
    <> 
      <div>
          
          <div>
            {message.map((msg) => (
              <div  key={msg._id || Math.random()} className="singlemessage">
                 {msg.Text}
                 {/* <span className="icon" onClick={(e)=>hndleEdite(e,msg._id)}>< BsPencil color="gray"/></span> */}
                 <span className="icon" onClick={(e)=>hndleDelete(e,msg._id,msg.Text)}>< BsTrash color="brown"/></span>
               
              </div>
          
               ))
            }
       
          </div>
        
          <input type="text" placeholder="type anything..."
            onChange={(e)=>setText(e.target.value)} value={text}/>

          <button onClick={Send}>Send</button>
      </div>
      
     </>
     );
}

export default ClientSide;
//at first we import  io in project for establish connection between client and server
//and listen to port for connection