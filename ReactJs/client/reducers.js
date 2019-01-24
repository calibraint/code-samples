/**
 * Root Reducer
 */
import { combineReducers } from 'redux'

// Import Reducers
import app from './modules/App/AppReducer'
import history from './modules/History/HistoryReducer'
import dashboard from './modules/Home/HomeReducer'
import report from './modules/Home/ReportsReducer'
import customise from './modules/Settings/SettingsReducer'
import chatbots from './modules/Chatbots/ChatbotsReducer'
import sectors from './modules/Chatbots/SectorsReducer'
import employees from './modules/Employees/EmployeesReducer'
import clients from './modules/Clients/ClientsReducer'
import paymentSettings from './modules/PaymentSettings/PaymentSettingsReducer'
import profile from './modules/Profile/ProfileReducer'
import intents from './modules/Intents/IntentsReducer'
import configure from './modules/ConfigureBot/ConfigureBotReducers'
import survey from './modules/SurveyBot/SurveyBotReducers'
import payment from './modules/Payments/PaymentReducer'
import myaccount from './modules/Account/AccountReducer'
import watsonservices from './modules/WatsonService/WatsonServiceReducer'
import { reducer as notifications } from 'react-notification-system-redux'

// Combine all reducers into one root reducer
export default combineReducers({
    app,
    history,
    dashboard,
    report,
    customise,
    chatbots,
    sectors,
    employees,
    clients,
    profile,
    intents,
    notifications,
    configure,
    survey,
    myaccount,
    payment,
    watsonservices,
    paymentSettings,
})
