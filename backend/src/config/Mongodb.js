import mongoose from "mongoose";
 const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://rahul25062:rahul123@forever.rvo0r.mongodb.net/Taskmanager"
    );
    console.log(
      `mongodb is connected successfully `
       
    );
  } catch (e) {
    console.log("error", e);
  }
};

export default connectDb ;