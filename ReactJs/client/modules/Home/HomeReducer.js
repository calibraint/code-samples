// Import Actions
import { GET_COUNTS } from './HomeActions'

// Initial State
export const initialState = {
    counts: {
        conversation: {},
        conversationSuccess: {},
        conversationFailed: {},
        successIntent: {},
        failedIntent: {},
        transferIntent: {},
        liveTransferredCount: {},
        totalTransferredCount: {},
        ratingAverage: {
            total: 0,
        },
        user: {},
    },
}

const HomeReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_COUNTS:
        return {
            counts: Object.assign({}, state.counts, action.payload),
        }

    default:
        return state
    }
}

// Get all counts
export const getCounts = state => state.dashboard.counts

// Export Reducer
export default HomeReducer
