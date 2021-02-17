// Import Actions
import { GET_CLIENTS, SELECTED_CLIENT } from './ClientsActions'

// Initial State
export const initialState = {
    clients: [],
    clientData: {},
}

const ClientsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_CLIENTS:
        return Object.assign({}, state, {
            clients: [ ...action.payload ],
        })
    case SELECTED_CLIENT: {
        return Object.assign({}, state, {
            clientData: action.payload,
        })
    }
    default:
        return state
    }
}

// Get all clients
export const getClient = state => state.clients.clients

// Get currently selected Client
export const getSelectedClient = state => state.clients.clientData

export default ClientsReducer
