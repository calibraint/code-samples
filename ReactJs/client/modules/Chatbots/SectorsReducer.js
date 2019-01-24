// Import Actions
import { GET_SECTORS, GET_CHATBOT_TYPES } from './SectorsActions'

// Initial State
const initialState = {
    sectors: [],
    types: [],
}

const SectorsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_SECTORS:
        return Object.assign({}, state, {
            sectors: [ ...(action.payload || []) ],
        })
    case GET_CHATBOT_TYPES:
        return Object.assign({}, state, {
            types: [ ...(action.payload || []) ],
        })
    default:
        return state
    }
}

// Get all chatbots

export const getSectors = state => state.sectors

export const getChatbotTypes = state => state.sectors

export default SectorsReducer
