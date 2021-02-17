import callApi from '../../util/apiCaller'
// Export Constants
export const GET_COUNTS = 'GET_COUNTS'
export const SET_REPORTS = 'SET_REPORTS'
export const GET_CHATBOT_INTENTS = 'GET_CHATBOT_INTENTS'

// Export Actions
export function setCounts(counts) {
    return {
        type: GET_COUNTS,
        payload: counts,
    }
}

export function fetchCounts(startDate = null, endDate = null) {
    return (dispatch, getState) => {
        const apiCall = (startDate && endDate) ? callApi('counts', 'post', {
            startDate,
            endDate,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }) : callApi('counts', 'post', {}, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        })
        return apiCall.then(res => {
            dispatch(setCounts(res.data.count))
        })
    }
}
