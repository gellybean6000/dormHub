import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/booking')
.then(() => {
    console.log('events connected')
})
.catch(() => {
    console.log('events not connected')
});

const bookingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    room:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    event:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
})

const slot = mongoose.model("slot", bookingSchema)

export default slot