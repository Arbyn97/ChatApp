import { useState } from "react";
// import ClientSide from '../ClientSide'
import { Navigate ,Link} from "react-router-dom";
function FormValidation() {
    const [UserId,SetUserId]=useState()
    const [UserPass,SetUserPass]=useState()
     const [alarm, setalarm] = useState('');
    const checking=async (e)=>
        {
            e.preventDefault();
            try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:UserId,password: UserPass }),
      });

      const data = await response.json();
const a=data.SessionId;
      if (response.ok) {
      //  <ClientSide roomId={data.SessionId}/>
      <Navigate to="/chat" replace/>
       console.log(a)
      } else {
        setalarm(data.message || 'خطا در ورود');
      }
    } catch (error) {
      setalarm('خطا در برقراری ارتباط با سرور');
    }
        }
    return (  

        <>
 <div className="form-css">
    <h1>Form Validation</h1>
      <div className="form-content">
         <form onSubmit={e=>checking(e)}>
          <p>UserName: <input type='text' value={UserId} onChange={e=>SetUserId(e.target.value)}/></p>
          <p>PassWord: <input type='password ' value={UserPass} onChange={e=>SetUserPass(e.target.value)}/></p>
          <button>Done</button>
          </form>
           {alarm && <p>{alarm}</p>}
      </div>
      <p className="register-text">Dont't you have registerd yet? Create your account right now. <Link to="/signin" className="blue-text">SignIn</Link></p>
</div>
        </>
    ); 
}

export default FormValidation;