import callApi from '../../util/apiCaller'

// Export Constants
export const GET_SECTORS = 'GET_SECTORS'
export const GET_CHATBOT_TYPES = 'GET_CHATBOT_TYPES'

// Export Actions
export function getSectors(sectors) {
    return {
        type: GET_SECTORS,
        payload: sectors,
    }
}

export function getChatbotTypes(types) {
    return {
        type: GET_CHATBOT_TYPES,
        payload: types,
    }
}

export function fetchSectors() {
    return (dispatch, getState) => callApi('getSectors', 'get', {}, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': getState().app.bot.id,
    }).then(res => {
        dispatch(getSectors(res.data))
    })
}

export function fetchChatbotTypes() {
    return (dispatch, getState) => callApi('getChatbotTypes', 'get', {}, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': getState().app.bot.id,
    }).then(res => {
        dispatch(getChatbotTypes(res.data))
    })
}
