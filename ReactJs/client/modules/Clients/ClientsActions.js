import callApi from '../../util/apiCaller'
import Notifications from 'react-notification-system-redux'
import _ from 'lodash'

// Export Constants
export const GET_CLIENTS = 'GET_CLIENTS '
export const SET_CLIENTS = 'SET_CLIENTS'
export const SELECTED_CLIENT = 'SELECTED_CLIENT'

const notificationOpts = {
    title: 'Client',
    message: 'Client has been updated!',
    position: 'tr',
    autoDismiss: 2,
}

// Export Actions
export function setClient(clients) {
    return {
        type: GET_CLIENTS,
        payload: clients,
    }
}

export function setClientData(data) {
    return {
        type: SELECTED_CLIENT,
        payload: data,
    }
}

export function fetchClient(data) {
    return (dispatch) => callApi('getClientsList', 'post', data, {
        'content-type': 'application/json',
        'x-chatbot-clientid': null,
        'x-chatbot-id': null,
    }).then(res => {
        if (res.status === 'success') {
            dispatch(setClient(res.data.clients))
        }
    })
}

export function createClient(data, successFn, errorFn) {
    return (dispatch) => callApi('createClient', 'post', {
        client: {
            adminName: data.name,
            email: data.email,
            password: data.password,
            companyName: data.companyName,
            aboutCompany: data.aboutCompany,
            website: data.websiteUrl,
            address: {
                street: data.street,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.zipCode,
                phone: data.phoneNumber,
            },
        },
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': null,
        'x-chatbot-id': null,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Data Successfully Saved!'
            dispatch(setClient(res.data.clients))
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

export function getClientById(data, successFn, errorFn) {
    return (dispatch) => callApi('getClientById', 'post', {
        id: data.id,
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': null,
        'x-chatbot-id': data.id,
    }).then(res => {
        if (res.status === 'success') {
            successFn(res)
            dispatch(setClientData(_.get(res, 'data.client', {})))
        } else {
            errorFn(res)
        }
    }).catch((err) => errorFn(err))
}

export function updateClient(data, successFn, errorFn) {
    return (dispatch) => callApi('updateClient', 'post', {
        client: {
            adminName: data.name,
            email: data.email,
            isActive: data.isActive,
            companyName: data.companyName,
            aboutCompany: data.aboutCompany,
            website: data.websiteUrl,
            address: {
                address: data.address,
                street: data.street,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.zipCode,
                phone: data.phoneNumber,
            },
        },
    }, {
        'content-type': 'application/json',
        'x-chatbot-clientid': null,
        'x-chatbot-id': null,
        'x-client-id': data.id,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Data Successfully Saved!'
            dispatch(setClient(res.data.clients))
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

export function deleteClient(data, successFn, errorFn) {
    return (dispatch) => callApi('deleteClient', 'post', {}, {
        'content-type': 'application/json',
        'x-chatbot-clientid': null,
        'x-chatbot-id': null,
        'x-client-id': data.id,
    }).then(res => {
        if (res.status === 'success') {
            notificationOpts.message = 'Successfully deleted!'
            dispatch(setClient(res.data.clients))
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
