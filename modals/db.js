import mongoose from "mongoose";
// const mongo_url=process.env.MONGO_URL

// function connectDB (){ 
// mongoose.connect(process.env.MONGO_URL)
//  .then(()=>{
//     console.log("mongo-db connected succesfully")
// })
// .catch(err=>{
//     console.log("mongo-db connection error",err)
// })
// }


// {
//     "fullname":"Amanmittal",
//     "email":"amanmittal@gmail.com",
//     "phoneNumber":"1234567891",
//     "password":"password123",
//     "role":"student"

// }

// OR

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongo-db connected succesfully")
    } catch (err) {
        console.log("mongo-db connection error", err)
    }

}

export default connectDB
