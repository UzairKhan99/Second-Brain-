//Schema 
import mongoose from "mongoose";
import { model, Schema, Document } from "mongoose";
///connection 
mongoose.connect(process.env.MONGO_URI as string || "mongodb://localhost:27017/")
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})  



// Interface for User document
export interface IUser extends Document {
    username: string;
    password: string;
}

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String }
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
