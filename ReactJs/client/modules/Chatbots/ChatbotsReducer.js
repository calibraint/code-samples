// Import Actions
import { GET_CHATBOTS } from './ChatbotsActions'

// Initial State
export const initialState = {
    chatbots: {
        watson: [],
        faq: [],
        survey: [],
        custom: [],
    },
}

const ChatbotsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_CHATBOTS:
        return Object.assign({}, state, {
            chatbots: action.payload,
        })
    default:
        return state
    }
}

// Get all chatbots
export const getChatbots = state => state.chatbots.chatbots

export default ChatbotsReducer
