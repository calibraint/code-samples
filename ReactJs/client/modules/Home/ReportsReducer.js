// Import Actions
import {
    LOADING,
    SET_REPORTS,
    SET_INTENTS,
    SET_INTENT,
    SET_INTENTLIST,
    SET_SUCCESSFUL_INTENTS,
    SET_FAILURE_INTENTS,
    SET_INTENTS_STATUS,
    GET_CLIENT_LIST,
    SET_CONVERSATION_REPORT,
    SET_CLIENT_PERFORMANCE,
    SET_CLIENT_CONVERSATION,
    SET_INTENT_EXAMPLE,
    SET_RATINGS,
    SET_CONVERSATION_HOURLY,
} from './ReportsActions'

// Initial State
export const initialReportState = {
    reports: {
        status: 'fail',
        data: {
            conversationReport: [],
        },
        loading: false,
    },
    intents: {
        status: 'fail',
        data: {
            intentsReport: [],
        },
        loading: false,
    },
    intentList: {
        status: 'fail',
        data: {
            intentListReport: [],
        },
        loading: false,
    },
    intent: {
        status: 'fail',
        data: {
            intentData: [],
        },
        loading: false,
    },
    intentStatus: {
        status: 'fail',
        data: {
            intentsStatus: [],
        },
        loading: false,
    },
    success: {
    },
    failure: {
    },
    clientList: {
        status: 'fail',
        data: {
            clientsReport: [],
        },
        loading: false,
    },
    conversationReportFilter: {
        data: {
            filterconversation: {},
        },
    },
    clientPerformance: {
        status: 'fail',
        data: [],
        loading: false,
    },
    clientConversationReport: {
        status: 'fail',
        data: [],
        loading: false,
    },
    intentExample: [],
    ratingsReport: {
        status: 'fail',
        data: [],
        loading: false,
    },
    conversationHourly: {
        status: 'fail',
        data: [],
        loading: false,
    },
}

const ReportsReducer = (state = initialReportState, action) => {
    switch (action.type) {
    case LOADING:
        return Object.assign({}, state, {
            [action.payload]: Object.assign({}, {
                data: Object.assign({}),
                loading: true,
            }),
        })
    case SET_REPORTS:
        return Object.assign({}, state, {
            reports: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    case SET_INTENTS:
        return Object.assign({}, state, {
            intents: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    case SET_INTENT:
        return Object.assign({}, state, {
            intent: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    case SET_INTENTLIST:
        return Object.assign({}, state, {
            intentList: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })

    case SET_INTENTS_STATUS:
        return Object.assign({}, state, {
            intentStatus: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    case SET_SUCCESSFUL_INTENTS:
        return Object.assign({}, state, {
            success: Object.assign({}, action.payload),
        })
    case SET_FAILURE_INTENTS:
        return Object.assign({}, state, {
            failure: Object.assign({}, action.payload),
        })
    case GET_CLIENT_LIST:
        return Object.assign({}, state, {
            clientList: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    case SET_CONVERSATION_REPORT:
        return Object.assign({}, state, {
            conversationReportFilter: Object.assign({}, {
                data: Object.assign({}, action.payload.data),
            }),
        })
    case SET_CLIENT_PERFORMANCE:
        return Object.assign({}, state, {
            clientPerformance: Object.assign({}, {
                status: action.payload.status,
                data: action.payload.data,
                loading: false,
            }),
        })
    case SET_CLIENT_CONVERSATION:
        return Object.assign({}, state, {
            clientConversationReport: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    case SET_INTENT_EXAMPLE: {
        return Object.assign({}, state, {
            intentExample: [ ...(action.payload || []) ],
        })
    }
    case SET_RATINGS: {
        return Object.assign({}, state, {
            ratingsReport: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    }
    case SET_CONVERSATION_HOURLY: {
        return Object.assign({}, state, {
            conversationHourly: Object.assign({}, {
                status: action.payload.status,
                data: Object.assign({}, action.payload.data),
                loading: false,
            }),
        })
    }
    default:
        return state
    }
}

// Get all counts
export const getReports = state => state.report.reports

export const getIntents = state => state.report.intents

export const getSuccessfulIntents = state => state.report.success

export const getFailureIntents = state => state.report.failure

export const getIntentStatus = state => state.report.intentStatus

export const getIntentList = state => state.report.intentList

export const getIntent = state => state.report.intent

export const getClientList = state => state.report.clientList

export const getConversationFilter = state => state.report.conversationReportFilter

export const getClientPerformance = state => state.report.clientPerformance

export const getClientConversation = state => state.report.clientConversationReport

export const getChatbotIntents = state => state.report.intentExample

export const getRatings = state => state.report.ratingsReport

export const getConversationHourly = state => state.report.conversationHourly

// Export Reducer
export default ReportsReducer
