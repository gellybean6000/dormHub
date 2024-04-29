import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/register')
.then(() => {
    console.log('mongodb connected')
})
.catch(() => {
    console.log('mongodb not connected')
});

const signupSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    room:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    }
})

const collection = mongoose.model("collection", signupSchema)

export default collection