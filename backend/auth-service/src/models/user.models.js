import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        uid: {
            type: String,
            index: true,
            unique: true,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true  
        },
        photoURL: {
            type: String,
            default: null
        },
        theme: {
            type: String,
            default: "light"
        },
        isPremium: {
            type: Boolean,
            default: false
        },
        completedCourse: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "OurCourse"
            }
        ],
        chatLimit: {
            type: Number,
            default: 100
        },
        language: {
            type: String,
            default: "en"
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)
export default User