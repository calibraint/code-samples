import callApi from '../../util/apiCaller'
// Export Constants
export const SET_USER = 'SET_USER'
export const GET_USER = 'GET_USER'
export const SET_CLIENT_ID = 'SET_CLIENT_ID'
export const SET_BOT_ID = 'SET_BOT_ID'
export const SET_CLIENT_NAME = 'SET_CLIENT_NAME'
export const SET_BOT_NAME = 'SET_BOT_NAME'

// Export Actions
export function setUser(user) {
    return {
        type: SET_USER,
        payload: user,
    }
}

export function getUser() {
    return {
        type: GET_USER,
    }
}

export function setClientId(clientId) {
    return {
        type: SET_CLIENT_ID,
        payload: {
            id: clientId,
        },
    }
}

export function setBotId(botId) {
    return {
        type: SET_BOT_ID,
        payload: {
            id: botId,
        },
    }
}

export function setBotName(botName, typeId, isTrained) {
    return {
        type: SET_BOT_NAME,
        payload: {
            name: botName,
            type: typeId,
            isTrained,
        },
    }
}

export function setClientName(clientName) {
    return {
        type: SET_CLIENT_NAME,
        payload: {
            name: clientName,
        },
    }
}

export function getClientById() {
    return (dispatch, getState) => {
        if (getState().app.client.id) {
            return callApi('getClientById', 'post', {
                id: getState().app.client.id ? getState().app.client.id : '',
            }, {
                'content-type': 'application/json',
                'x-chatbot-clientid': getState().app.client.id,
                'x-chatbot-id': null,
            }).then(res => {
                if (res.status === 'success') {
                    dispatch(setClientName(res.data.client.clientAdmin.clientName))
                }
            })
        }
        return null
    }
}

export function getChatbotById() {
    return (dispatch, getState) => {
        if (getState().app.bot.id) {
            return callApi('getChatbotById', 'post', {
                id: getState().app.bot.id ? getState().app.bot.id : '',
            }, {
                'content-type': 'application/json',
                'x-chatbot-clientid': getState().app.client.id,
                'x-chatbot-id': getState().app.bot.id,
            }).then(res => {
                if (res.status === 'success') {
                    dispatch(setBotName(res.data.name, res.data.typeId.name, res.data.isTrained))
                }
            })
        }
        return null
    }
}
