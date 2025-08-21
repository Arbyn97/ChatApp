import {createContext, useContext,useState,useEffect}from 'react'
import { io } from "socket.io-client";

const socketContext=createContext(null);
const sessionContext = createContext(null);

function MyContext({children}) {
    // const socketRef=useRef(null)
     const [socket, setSocket] = useState(null);
      const [sessionId, setSessionId] = useState(null);
    useEffect(() => {
     const newSocket = io('http://localhost:4000');
    
      newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setSocket(newSocket);
    });
    return () => {
     newSocket.disconnect();
      console.log('❌ Socket disconnected');
    };
  }, []);


    return ( 
        <>
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
        </>
     );
}

export default MyContext;
/////// یک custom hook هست که کار دسترسی به مقدار context (که همون socketRef هست) رو ساده و تمیز می‌کنه.
export const useSocket = () => {
  const context = useContext(socketContext);
  return context && context.socket;
};

/////از useRef استفاده کردیم
/////گر socketRef تعریف شده باشه (نه null و نه undefined)، ادامه بده به دسترسی به .current

// اما اگر socketRef وجود نداشته باشه (null یا undefined بود)، کل عبارت undefined برمی‌گرده بدون اینکه خطا بیفته
// اگر socketRef از Context گرفته می‌شه، ممکنه کامپوننتی قبل از اینکه Provider مقدارشو قرار بده رندر بشه

// در این حالت مقدار Context برابر undefined هست

export const useSession = () => {
  const context = useContext(sessionContext);
  return context?.sessionId;
};

// ست کردن sessionId
export const useSetSession = () => {
  const context = useContext(sessionContext);
  return context?.setSessionId;
};