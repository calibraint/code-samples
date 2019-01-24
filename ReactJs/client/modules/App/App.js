import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getChatbotById, getClientById } from './AppActions'
import { getProfile } from '../Profile/ProfileReducer'
import { fetchProfile } from '../Profile/ProfileAction'
import { withRouter } from 'react-router'
import * as _ from 'lodash'


// Import Components
import Helmet from 'react-helmet'
import DevTools from './components/DevTools'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'

import { getUser, getBotId, getClientId, getBotName, getClientName, getBotType, getBotTrainedStatus } from './AppReducer'
import { compose } from 'redux'

export class App extends Component {
    constructor(props) {
        super(props)
        this.state = { isMounted: false }
    }

    componentWillMount() {
        this.props.getChatbotById()
        this.props.getClientById()
        this.props.fetchProfile()
    }

    componentDidMount() {
        this.setState({ isMounted: true })
    }

    render() {

        const { isMounted } = this.state
        const { user, location, clientId, botId, userData, typeID, clientName, botName, isTrained } = this.props

        const chatbotTypeName = typeID && typeID.name || ''
        const locationPathname = location && location.pathname || ''
        const profilePhoto = userData && userData.avatar || '/assets/img/empty.png'
        const paymentMode = userData && userData.paymentMode
        const isPaid = userData && userData.isPaid || true

        return (
            <div>
                {isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
                <div>
                    <Helmet
                        title="Clever Chatbot"
                        titleTemplate="%s - App"
                        meta={[
                            { charset: 'utf-8' },
                            {
                                'http-equiv': 'X-UA-Compatible',
                                content: 'IE=edge',
                            },
                            {
                                name: 'viewport',
                                content: 'width=device-width, initial-scale=1',
                            },
                        ]}
                    />
                    <div>
                        <Sidebar
                            user={user}
                            photo={profilePhoto}
                            location={locationPathname}
                            clientId={clientId}
                            chatbotId={botId}
                            userData={userData}
                            typeID={chatbotTypeName}
                            isPaid={isPaid}
                            paymentMode={paymentMode}
                        />
                        <Header
                            toggleSidebar={this.toggleSidebar}
                            photo={profilePhoto}
                            user={user}
                            location={locationPathname}
                            clientId={clientId}
                            clientName={clientName}
                            botName={botName}
                            botId={botId}
                            userData={userData}
                            isTrained={isTrained}
                            botType={chatbotTypeName}
                        />
                    </div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

App.propTypes = {
    getChatbotById: PropTypes.func.isRequired,
    getClientById: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    botId: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    botName: PropTypes.object.isRequired,
    typeID: PropTypes.object.isRequired,
    clientName: PropTypes.string.isRequired,
    userData: PropTypes.object.isRequired,
    isTrained: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
}

App.defaultProps = {
    botId: '',
    clientId: '',
    typeID: {},
}

const mapDispatchToProps = (dispatch) => ({
    getChatbotById: () => {
        dispatch(getChatbotById())
    },
    getClientById: () => {
        dispatch(getClientById())
    },
    fetchProfile: () => {
        dispatch(fetchProfile())
    },
})

// Retrieve data from store as props
function mapStateToProps(state) {
    return {
        user: getUser(state),
        botId: getBotId(state),
        clientId: getClientId(state),
        botName: getBotName(state),
        typeID: getBotType(state),
        clientName: getClientName(state),
        userData: getProfile(state),
        isTrained: getBotTrainedStatus(state),
    }
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(App)
