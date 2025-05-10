import mongoose from "mongoose";

const reactionTypes = ["like", "laugh", "angry", "dislike"];

const postSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, "Text content is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        reactions: [
            {
                type: {
                    type: String,
                    enum: reactionTypes,
                    required: [true, "Reaction type is required"],
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: [true, "User is required"],
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
