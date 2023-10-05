import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false)

export default connect(process.env.MONGO_URI!)
.then((connection)=> {
    console.log('##### CONNECTION TO DATABSE ESTABLISHED ##### \n')
})
.catch((error:any)=> console.log('#### THERE WAS AN ERROR CONNECTING TO DATABSE \n', error));
