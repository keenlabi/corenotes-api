import { connect } from "mongoose"

connect(process.env.MONGO_URI!)
.then(()=> {
    console.log(`################# CONNECTION TO DATABASE SUCCESSFUL ######################`)
})
.catch((error)=> {
    console.log(`################# CONNECTION TO DATABASE FAILED ######################`)
    console.log(error)
})