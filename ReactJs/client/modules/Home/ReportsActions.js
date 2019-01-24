import callApi from '../../util/apiCaller'
import Notifications from 'react-notification-system-redux'

// Export Constants
export const LOADING = 'LOADING'
export const SET_REPORTS = 'SET_REPORTS'
export const SET_INTENTS = 'SET_INTENTS'
export const SET_INTENT = 'SET_INTENT'
export const SET_INTENTLIST = 'SET_INTENTLIST'
export const SET_SUCCESSFUL_INTENTS = 'SET_SUCCESSFUL_INTENTS'
export const SET_FAILURE_INTENTS = 'SET_FAILURE_INTENTS'
export const SET_INTENTS_STATUS = 'SET_INTENTS_STATUS'
export const GET_CLIENT_LIST = 'GET_CLIENT_LIST'
export const SET_CONVERSATION_REPORT = 'SET_CONVERSATION_REPORT'
export const SET_CLIENT_PERFORMANCE = 'SET_CLIENT_PERFORMANCE'
export const SET_CLIENT_CONVERSATION = 'SET_CLIENT_CONVERSATION'
export const SET_INTENT_EXAMPLE = 'SET_INTENT_EXAMPLE'
export const SET_RATINGS = 'SET_RATINGS'
export const SET_CONVERSATION_HOURLY = 'SET_CONVERSATION_HOURLY'

const notificationOpts = {
    title: 'Example',
    message: 'Example has been Added!',
    position: 'tr',
    autoDismiss: 2,
}

// Export Actions
export function loading(stateName) {
    return {
        type: LOADING,
        payload: stateName,
    }
}

export function setIntentReports(reports) {
    return {
        type: SET_INTENTS,
        payload: reports,
    }
}

export function setIntent(data) {
    return {
        type: SET_INTENT,
        payload: data,
    }
}

export function setIntentStatus(data) {
    return {
        type: SET_INTENTS_STATUS,
        payload: data,
    }
}

export function setSuccessfulIntents(data) {
    return {
        type: SET_SUCCESSFUL_INTENTS,
        payload: data,
    }
}

export function setFailureIntents(data) {
    return {
        type: SET_FAILURE_INTENTS,
        payload: data,
    }
}

export function getClientsReport(clientList) {
    return {
        type: GET_CLIENT_LIST,
        payload: clientList,
    }
}

export function setConversationReportFilter(conversationReportFilter) {
    return {
        type: SET_CONVERSATION_REPORT,
        payload: conversationReportFilter,
    }
}

export function setClientPerformance(clientPerfomance) {
    return {
        type: SET_CLIENT_PERFORMANCE,
        payload: clientPerfomance,
    }
}

export function setUserConversationReports(reports) {
    return {
        type: SET_CLIENT_CONVERSATION,
        payload: reports,
    }
}

export function setIntentListReports(reports) {
    return {
        type: SET_INTENTLIST,
        payload: reports,
    }
}

export function setChatbotIntents(intents) {
    return {
        type: SET_INTENT_EXAMPLE,
        payload: intents,
    }
}

export function setRatings(ratings) {
    return {
        type: SET_RATINGS,
        payload: ratings,
    }
}

export function setConversationHourly(hourly) {
    return {
        type: SET_CONVERSATION_HOURLY,
        payload: hourly,
    }
}

export function fetchIntentReports(data) {
    return (dispatch, getState) => {
        dispatch(loading('intents'))
        return callApi('intentReports', 'post', {
            intentReports: data,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            let intents = res; // eslint-disable-line
            intents.data.intentsReport.forEach((val, index) => {
                intents.data.intentsReport[index].name = val.intent
                intents.data.intentsReport[index].value = val.total
                delete intents.data.intentsReport[index].intent
                delete intents.data.intentsReport[index].total
            })
            dispatch(setIntentReports(intents))
        }).catch(() => {
            dispatch(setIntentReports({
                status: 'fail',
            }))
        })
    }
}

export function fetchIntentsList() {
    return (dispatch, getState) => {
        dispatch(loading('intents'))
        return callApi('intentsList', 'post', {}, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            let intents = res; // eslint-disable-line
            intents.data.intentsList.forEach((val, index) => {
                intents.data.intentsList[index] = val
            })
            dispatch(setIntentListReports(intents))
        }).catch(() => {
            dispatch(setIntentListReports({
                status: 'fail',
            }))
        })
    }
}

export function fetchIntent(data) {
    return (dispatch, getState) => {
        dispatch(loading('intentStatus'))
        return callApi('intent', 'post', data, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            dispatch(setIntent(res))
        }).catch(() => {
            dispatch(setIntent({
                status: 'fail',
            }))
        })
    }
}

export function fetchIntentStatus(data, successFu) {
    return (dispatch, getState) => {
        dispatch(loading('intentStatus'))
        return callApi('intentStatus', 'post', {
            dates: data,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            successFu(res)
            dispatch(setIntentStatus(res))
        }).catch(() => {
            dispatch(setIntentStatus({
                status: 'fail',
            }))
        })
    }
}

export function fetchSuccessfulIntents(data) {
    return (dispatch, getState) => {
        dispatch(loading('success'))
        return callApi('successIntents', 'post', {
            dates: data,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            dispatch(setSuccessfulIntents(res))
        }).catch(() => {
            dispatch(setSuccessfulIntents({
                status: 'fail',
            }))
        })
    }
}

export function fetchFailureIntents(data) {
    return (dispatch, getState) => {
        dispatch(loading('failure'))
        return callApi('failureIntents', 'post', {
            dates: data,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            dispatch(setFailureIntents(res))
        }).catch(() => {
            dispatch(setFailureIntents({
                status: 'fail',
            }))
        })
    }
}

export function fetchClients(data) {
    return (dispatch) => {
        dispatch(loading('topClientsReport'))
        return callApi('getClientsReport', 'post', {
            topClients: data,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': '',
            'x-chatbot-id': '',
        }).then(res => {
            let topClientsReport = res; // eslint-disable-line
            topClientsReport.data.clientsReport.forEach((val, index) => {
                topClientsReport.data.clientsReport[index].value = val.total
                topClientsReport.data.clientsReport[index].name = val.client
                delete topClientsReport.data.clientsReport[index].total
                delete topClientsReport.data.clientsReport[index].client
            })
            dispatch(getClientsReport(topClientsReport))
        }).catch(() => {
            dispatch(getClientsReport({
                status: 'fail',
            }))
        })
    }
}

export function fetchConversationReportFilter(data) {
    return (dispatch) => callApi('getConversationReportFilter', 'post', {
        clientId: data.clientId,
        sectorId: data.sectorId,
        chatbotId: data.chatbotId,
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': '',
        'x-chatbot-id': '',
    }).then(res => {
        dispatch(setConversationReportFilter(res))
    }).catch(() => {
        dispatch(setConversationReportFilter({
            status: 'fail',
        }))
    })
}

export function fetchClientPerformance() {
    return (dispatch) => callApi('clientPerformance', 'post', {
        'content-type': 'application/json',
        'x-chatbot-clientid': '',
        'x-chatbot-id': '',
    }).then(res => {
        dispatch(setClientPerformance(res))
    }).catch(() => {
        dispatch(setClientPerformance({
            status: 'fail',
        }))
    })
}

export function fetchUserConversationReports(data) {
    return (dispatch, getState) => {
        dispatch(loading('reports'))
        return callApi('clientConversationReports', 'post', {
            conversationReports: data,
        }, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            dispatch(setUserConversationReports(res))
        }).catch(() => {
            dispatch(setUserConversationReports({
                status: 'fail',
            }))
        })
    }
}
export function setReport(data) {
    return (dispatch) => {
        dispatch(setIntentReports(data.intents))
        dispatch(setIntent(data.intent))
        dispatch(setIntentStatus(data.intentStatus))
        dispatch(setSuccessfulIntents(data.success))
        dispatch(setFailureIntents(data.failure))
        dispatch(getClientsReport(data.clientList))
        dispatch(setConversationReportFilter(data.conversationReportFilter))
        dispatch(setClientPerformance(data.clientPerformance))
        dispatch(setUserConversationReports(data.clientConversationReport))
        dispatch(setIntentListReports(data.intentList))
    }
}

export function fetchChatbotIntents() {
    return (dispatch, getState) => callApi('fetchIntents', 'post', {
        chatbotId: getState().app.bot.id,
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': getState().app.bot.id,
    }).then(res => {
        dispatch(setChatbotIntents(res.data))
    }).catch()
}
export function insertExample(data, successFn, errorFn) {
    return (dispatch, getState) => callApi('insertExample', 'post', {
        intentId: data.intentId,
        examples: data.examples,
        conversationId: data.conversationId,
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': getState().app.client.id,
        'x-chatbot-id': getState().app.bot.id,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Data Successfully Saved!'
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

export function fetchRatings(data) {
    return (dispatch, getState) => {
        dispatch(loading('ratingsReport'))
        return callApi('ratingsReport', 'post', data, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            dispatch(setRatings(res))
        }).catch(() => {
            dispatch(setRatings({
                status: 'fail',
            }))
        })
    }
}


export function fetchConversationHourly(data) {
    return (dispatch, getState) => {
        dispatch(loading('conversationHourly'))
        return callApi('conversationHourlyReport', 'post', data, {
            'content-type': 'application/json',
            'x-chatbot-clientid': getState().app.client.id,
            'x-chatbot-id': getState().app.bot.id,
        }).then(res => {
            dispatch(setConversationHourly(res))
        }).catch(() => {
            dispatch(setConversationHourly({
                status: 'fail',
            }))
        })
    }
}

