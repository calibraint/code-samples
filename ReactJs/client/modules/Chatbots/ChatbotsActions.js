import callApi from '../../util/apiCaller'

import Notifications from 'react-notification-system-redux'
// Export Constants
export const GET_CHATBOTS = 'GET_CHATBOTS'
export const SET_CHATBOTS = 'SET_CHATBOTS'

const notificationOpts = {
    title: 'Chatbot',
    message: 'Profile has been updated!',
    position: 'tr',
    autoDismiss: 2,
}

// Export Actions
export function setChatbots(chatbots) {
    return {
        type: GET_CHATBOTS,
        payload: chatbots,
    }
}

export function fetchChatbots(data) {
    return (dispatch, getState) => callApi('getChatbotsList', 'post', data, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': getState().app.bot.id,
    }).then(res => {
        dispatch(setChatbots(res.data))
    })
}

export function createChatbot(data, successFn, errorFn) {
    return (dispatch, getState) => callApi('createChatbot', 'post', {
        chatbot: {
            name: data.name,
            description: data.description,
            sectorId: data.sectorId,
            typeId: data.typeId,
            projectNo: data.projectNo,
            language: data.language,
        },
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': getState().app.bot.id,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Data Successfully Saved!'
            const { chatbots /* , createdChatbotId */ } = res.data
            dispatch(setChatbots(chatbots))
            successFn()
            dispatch(Notifications.success(notificationOpts))
        } else {
            errorFn(res)
            notificationOpts.message = res.message
            notificationOpts.autoDismiss = 5
            dispatch(Notifications.error(notificationOpts))
        }
    }).catch()
}

export function getChatbotById(data, successFn, errorFn) {
    return (dispatch, getState) => callApi('getChatbotById', 'post', {
        id: data.id,
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': data.id,
    }).then(res => {
        if (res.status === 'success') {
            successFn(res)
        } else {
            errorFn(res)
        }
    }).catch((err) => errorFn(err))
}

export function updateChatbot(data, successFn, errorFn) {
    return (dispatch, getState) => callApi('updateChatbot', 'post', {
        chatbot: {
            name: data.name,
            description: data.description,
            isActive: data.isActive,
            projectNo: data.projectNo,
        },
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': data.id,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Data Successfully Saved!'
            dispatch(setChatbots(res.data))
            successFn(res)
            dispatch(Notifications.success(notificationOpts))
        } else {
            errorFn(res)
            notificationOpts.message = res.message
            notificationOpts.autoDismiss = 5
            dispatch(Notifications.error(notificationOpts))
        }
    }).catch(() => errorFn())
}

export function deleteChatbot(data, successFn, errorFn) {
    return (dispatch, getState) => callApi('deleteChatbot', 'post', {}, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': data.id,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Successfully deleted!'
            dispatch(setChatbots(res.data))
            successFn(res)
            dispatch(Notifications.success(notificationOpts))
        } else {
            errorFn(res)
            notificationOpts.message = res.message
            notificationOpts.autoDismiss = 5
            dispatch(Notifications.error(notificationOpts))
        }
    }).catch(() => errorFn())
}
