import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import Routes from './src/routes/api.js';

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', Routes);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to my API' });
});


//connect to mongodb
async function connect(){
  try{
    mongoose.connect(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
    console.log("Connected to the database");
  }catch(error){
    console.log(`Error => ${error}`);
  }
}

connect()

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on ${port}`);
});
