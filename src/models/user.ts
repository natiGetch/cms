import mongoose from "mongoose";
const UserShema = new mongoose.Schema({
    userName : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    role : {
        type : String,
        enum : ['superAdmin','admin'],
        require : true
    }
})
export default mongoose.models.UserShema || mongoose.model("UserShema", UserShema);