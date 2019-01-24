import fetch from 'isomorphic-fetch'
import clientConfig from '../config/clientConfig'

const isServer = (typeof window === 'undefined' || process.env.NODE_ENV === 'test')

export const API_URL = isServer
    ? `http://localhost:${clientConfig.port}/api`
    : '/api'

export default function callApi(endpoint, method = 'get', body = {}, headers = {
    'content-type': 'application/json',
    'x-chatbot-clientid': '58ad27d6067950e7b70ea0d2',
    'x-chatbot-id': '58b4182305680cf51b03b4a8',
}) {
    return fetch(`${API_URL}/${endpoint}`, method !== 'get' ? {
        credentials: 'same-origin',
        headers,
        method,
        body: JSON.stringify(body),
    } : {
        credentials: 'same-origin',
        headers,
        method,
    })
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json)
            }

            return json
        })
        .then(
            response => response,
            error => error
        )
}
