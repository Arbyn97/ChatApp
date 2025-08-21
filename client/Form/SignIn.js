import { useState } from "react";
// import ClientSide from '../ClientSide'
import { Navigate } from "react-router-dom";
import { useSetSession } from '../../Requierment/MyContext';
function SignIn() {
    let [passWord,setPassWord]=useState()
    let [userName,setUserName]=useState()
    let [Email,SetEmail]=useState()
    const [alarm, setalarm] = useState('');

     const setSessionId = useSetSession();
      const [redirect, setRedirect] = useState(false); // برای ریدایرکت

   
    const checkformval=async(e)=>{
         e.preventDefault();
        const response= await fetch('http://localhost:4000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userName, password: passWord, email: Email }),
      })
       const data = await response.json();
      if (response.ok && data.sessionId) {
          setSessionId(data.sessionId);
          // <ClientSide roomId={data.SessionId}/>
           <Navigate to="/chat" replace/>
      } else {
        setalarm(data.message || 'خطا در ورود');
      }

    }

    
    return (  
        <>
        <div className="form-css">
    <h1>SignIn</h1>
      <div className="form-content">
        <form>
          <p>UserName: <input type='text' onChange={e=>setUserName(e.target.value)}/></p>
          <p>PassWord: <input type='text' onChange={e=>setPassWord(e.target.value)}/></p>
          <p>Email:    <input type='text' onChange={e=>SetEmail(e.target.value)}/></p>
          <button onClick={e=>checkformval(e)}>Create</button>
        </form>
         {alarm && <p>{alarm}</p>}
      </div>
     
</div>
        </>
    );
}

export default SignIn;