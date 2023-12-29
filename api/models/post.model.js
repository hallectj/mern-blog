import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId:{
      type: String,
      required: true
    },
    content:{
      type: String,
      required: true
    },
    title:{
      type: String,
      required: true,
      unique: true
    },
    image:{
      type: String,
      default: "https://s3.amazonaws.com/thumbnails.venngage.com/template/3bfb507f-e79f-4001-ae63-8a0f446113c3.png"
    },
    category:{
      type: String,
      default: "Uncategorized"
    },
    slug:{
      type: String,
      required: true,
      unique: true
    },
  }, {timestamps: true}
);

const Post = mongoose.model("Post", postSchema);
export default Post;