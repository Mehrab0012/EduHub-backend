const { MongoClient, ServerApiVersion } = require('mongodb');
const cors =require('cors');
const app=express();
const port =3000;
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://EduHub:3srD59nJyZPIMUcA@cluster0.pvnuook.mongodb.net/?appName=Cluster0";


//3srD59nJyZPIMUcA
//EduHub
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    const db = client.db('EduHub');
    const courses = db.collection('courses');

    appget.


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);