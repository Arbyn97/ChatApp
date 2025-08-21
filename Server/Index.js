
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const { Session } = require('inspector/promises');
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const uri =""

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function main() {
  await client.connect();
  const dbo = client.db("mymessages");
  
  const collection = dbo.collection("collection1");
  const usersCollection = dbo.collection("registery");

  console.log("✅ MongoDB connected.");

  io.on('connection', (socket) => {
    console.log('🟢 Client connected');


//اتصال به چت روم

  // کاربر به روم اختصاصی‌ش می‌پیونده
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });


    socket.on('recived', async (data) => { 
      try {
        // const messages = await collection.find({roomId}).toArray();
        // const texts = messages.map(m => m.Text);
        
       const roomId = data.roomId;
  const messages = await collection.find({ roomId }).toArray();
       
        socket.emit('all messages', messages);
      } catch (err) {
        console.error("❌ Error fetching messages", err);
      }
    });



socket.on('message', async ({roomId,message}) => {
   try {
    const result = await collection.insertOne({ Text: message, roomId });
    const newMessage = { _id: result.insertedId, Text: message, roomId };
    io.to(roomId).emit('message', newMessage);
  } catch (err) {
    console.error("❌ Error inserting message:", err);
  }
});
    socket.on('disconnect', () => { 
      console.log("🔴 Client disconnected");
    });
  });
 
  
//Api for Form
//یه لینک براش درست میکنیم
  app.post('/api/login', async (req, res) =>
     {
    const { id, password } = req.body;//req.body یعنی تکام داده هایی که کلاینت میفرسته رو بیا بریز توی این دوتا متغیر.اگر ای دی بود بری او ای دی اگر پسورد بود بریز تو پسورد

    try {
      // جستجو در کالکشن ثبت نام شده‌ها
      const user = await usersCollection.findOne({ Id: id, Password: password });
///حالا بیا توی دیتابیس دنبالش بگرد
      if (user) {
        res.json({ message: 'ورود موفقیت‌آمیز بود!' ,SessionId:user._id});
      } else {
        res.status(400).json({ message: 'ای دی یا پسورد اشتباه است.' });
      }
    } catch (err) {
      console.error("Error in login route:", err);
      res.status(500).json({ message: 'خطای سرور' });
    }
  });

 app.post('/api/signin', async (req, res) =>
   {
  
         const { id, password ,email} = req.body;
         //req.body یعنی تکام داده هایی که کلاینت میفرسته رو بیا بریز توی این دوتا متغیر.اگر ای دی بود بری او ای دی اگر پسورد بود بریز تو پسورد
        
    try {
      
      const user = await usersCollection.findOne({ Id: id, Password: password ,Email:email});
     
///حالا بیا توی دیتابیس دنبالش بگرد
      if (!user) {
        await usersCollection.insertOne({Id: id, Password: password ,Email:email});
          res.json({ message: 'ثبت نام موفقیت‌آمیز بود!' ,sessionId:user.insertedId});
      } else { 
        res.json({ message: 'این حساب وجود دارد!' });
       
      }
    } catch (err) {
      console.error("Error in login route:", err);
      res.status(500).json({ message: 'خطای سرور' });
    } 
   });
   app.post('/api/delete',async(req,res)=>{
    const {id}=req.body;
    try{
       const objectId = new ObjectId(id); // تبدیل رشته به ObjectId
        const delMessage = await collection.findOne({ _id: objectId});
         if (delMessage) {
        await collection.deleteOne({_id:objectId});
          res.json({ message: 'deleted!' });
      } else { 
        res.json({ message: 'was a problem!' });
       
      } 
    }
    catch{console.error("Error deleting message:", err);
    res.status(500).json({ message: 'Internal server error' });
}
   })
    app.post('/api/edit',async(req,res)=>{
    const {id,text}=req.body;
    try{
       const objectId = new ObjectId(id); // تبدیل رشته به ObjectId
        const delMessage = await collection.findOne({ _id: objectId});
         if (delMessage) {
        await collection.updateOne( { _id: objectId },
        { $set: { Text:text } });
          res.json({ message: 'deleted!' });
      } else { 
        res.json({ message: 'was a problem!' });
       
      } 
    }
    catch{console.error("Error deleting message:", err);
    res.status(500).json({ message: 'Internal server error' });
}
   })
  server.listen(4000, () => {
    console.log('🚀 Server is running on port 4000');
  });
}

main().catch(console.error);


async function createCollection() {
  try {
    await client.connect();
    const db = client.db("mymessages");
    const collections = await db.listCollections({ name: "registery" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("registery");
      console.log('Collection "registery" created successfully.');
    } else {
      console.log('Collection "registery" already exists.');
    }
  } catch (err) {
    console.error("Error creating collection:", err);
  } finally {
    await client.close();
  }
}
// createCollection()
 

 
