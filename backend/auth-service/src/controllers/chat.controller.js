import wrapper from "../utils/Wrapper.js";
import Chat from '../models/chat.models.js';


const sendChatController = wrapper( async (req , res) => {
    return {
        "chat": "Sample Chat"
    }
})

export { sendChatController }