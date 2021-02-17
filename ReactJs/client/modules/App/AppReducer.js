// Import Actions
import { SET_USER, SET_BOT_ID, SET_CLIENT_ID, SET_CLIENT_NAME, SET_BOT_NAME } from './AppActions'

// Initial State
const initialState = {
    user: { },
    client: {
        id: '',
    },
    bot: {
        id: '',
    },
    botName: {
        name: '',
    },
    clientName: {
        name: '',
    },
    typeId: {
        name: '',
    },
    isTrained: {
        status: true,
    },
}

const AppReducer = (state = initialState, action) => {
    switch (action.type) {
    case SET_USER:
        return Object.assign({}, state, {
            user: action.payload,
        })
    case SET_BOT_ID:
        return Object.assign({}, state, {
            bot: action.payload,
        })
    case SET_CLIENT_ID:
        return Object.assign({}, state, {
            client: action.payload,
        })
    case SET_CLIENT_NAME:
        return Object.assign({}, state, {
            clientName: action.payload,
        })
    case SET_BOT_NAME:
        return Object.assign({}, state, {
            botName: { name: action.payload.name },
            typeID: { name: action.payload.type },
            isTrained: { status: action.payload.isTrained },
        })
    default:
        return state
    }
}

/* Selectors */

// Get user
export const getUser = (state) => state.app.user

export const getClientId = state => state.app.client.id

export const getBotId = state => state.app.bot.id

export const getBotName = state => state.app.botName

export const getBotType = state => state.app.typeID

export const getBotTrainedStatus = state => state.app.isTrained

export const getClientName = state => state.app.clientName.name

// Export Reducer
export default AppReducer
