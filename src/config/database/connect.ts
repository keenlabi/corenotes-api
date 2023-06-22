import mongoose, { connect } from 'mongoose';
import autoIncrement from "mongoose-auto-increment";


mongoose.set('strictQuery', false)

export default connect(process.env.MONGO_URI!)
.then((connection)=> {
    console.log('##### CONNECTION TO DATABSE ESTABLISHED ##### \n')

    // configure auto 
    autoIncrement.initialize(connection.connection)
})
.catch((error:any)=> console.log('#### THERE WAS AN ERROR CONNECTING TO DATABSE \n', error));
