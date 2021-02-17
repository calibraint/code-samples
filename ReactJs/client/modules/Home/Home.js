import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TopTiles } from './components/TopTiles/TopTiles'
import { getUser, getBotType } from '../App/AppReducer'
import { getCounts, initialState } from './HomeReducer'
import { fetchCounts, setCounts } from './HomeActions'
import { getChatbotById } from '../App/AppActions'
import { getIntents, getSuccessfulIntents, getFailureIntents, getIntentStatus, getIntentList, getIntent,
    getClientConversation, initialReportState, getRatings, getConversationHourly } from './ReportsReducer'
import {
    fetchUserConversationReports, fetchIntentReports, fetchSuccessfulIntents, fetchFailureIntents,
    fetchIntentStatus, fetchIntentsList, fetchIntent, setReport, fetchRatings, fetchConversationHourly,
} from './ReportsActions'
import * as _ from 'lodash'
import { trainWatson } from '../ConfigureBot/ConfigureBotActions'
import Hourly from './components/Hourly/Hourly'
import ConversationsPanel from './components/ConversationsPanel/ConversationsPanel'
import MessagesPanel from './components/MessagesPanel/MessagesPanel'
import IntentPercentagePanel from './components/IntentPercentagePanel/IntentPercentagePanel'
import IntentStatusPanel from './components/IntentStatus/IntentStatusPanel'

class Home extends Component {
    constructor(props) {
        super(props)

        const defaultStartDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
        const defaultEndDate = new Date().toISOString()
        this.state = {
            startDate: defaultStartDate,
            endDate: defaultEndDate,
            filterBy: '',
            selectedIntent: {
                startDate: defaultStartDate,
                endDate: defaultEndDate,
                filterBy: '',
            },
            fetchIntentReport: {
                startDate: defaultStartDate,
                endDate: defaultEndDate,
                intents: [],
            },
            page: 0,
            typeId: {},
            isTraining: false,
        }
    }


    componentDidMount() {
        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
        const endDate = new Date().toISOString()

        this.props.fetchCounts()
        this.props.getChatbotById()
        this.props.fetchUserConversationReports({ startDate, endDate })
        this.fetchIntentReports()
        this.fetchIntentStatus()

        this.props.fetchIntentsList()

        this.fetchIntent()

        this.props.fetchConversationHourly({ startDate, endDate })
    }

    componentWillUnmount() {
        this.props.setCounts(initialState.counts)
        this.props.setReport(initialReportState)
    }

    onConversationsPanelDateRangeChange = (start, end) => {
        this.props.fetchUserConversationReports({
            startDate: moment(start).format('YYYY-MM-DD, h:mm:ss'),
            endDate: new Date(end).toISOString(),
        })
    }

    onTopTilesDateRangeChange = (start, end) => {
        this.props.fetchCounts(
            moment(start).format('YYYY-MM-DD, h:mm:ss'),
            new Date(end).toISOString(),
        )
    }

    onHourlyPanelDateRangeChange = (start, end) => {
        this.props.fetchConversationHourly({
            startDate: moment(start).format('YYYY-MM-DD, h:mm:ss'),
            endDate: new Date(end).toISOString(),
        })
    }

    onIntentPercentagePanelDateRangeChange = (start, end) => {
        const fetchIntentReport = {
            ...this.state.fetchIntentReport,
            startDate: moment(start).format('YYYY-MM-DD, h:mm:ss'),
            endDate: new Date(end).toISOString(),
        }

        this.setState({ fetchIntentReport }, this.fetchIntentReports)
    }


    onMessagesPanelDateRangeChange = (start, end) => {
        const selectedIntent = {
            ...this.state.selectedIntent,
            startDate: moment(start).format('YYYY-MM-DD, h:mm:ss'),
            endDate: new Date(end).toISOString(),
        }
        this.setState({ selectedIntent }, this.fetchIntent)
    }

    onSelectIntentStatusFilter = (filterBy) => {
        this.setState({ filterBy }, this.fetchIntentStatus)
    }

    onIntentStatusDateRangeChange = (start, end) => {
        const startDate = moment(start).format('YYYY-MM-DD, h:mm:ss')
        const endDate = new Date(end).toISOString()
        this.setState({ startDate, endDate, page: 0 }, this.fetchIntentStatus)
    }

    selectMultipleIntent = (val) => {
        const intents = val || []
        const fetchIntentReport = {
            ...this.state.fetchIntentReport,
            intents,
        }

        this.setState({ fetchIntentReport }, this.fetchIntentReports)
    }

    selectIntent = (intent) => {
        const selectedIntent = {
            ...this.state.selectedIntent,
            filterBy: intent,
        }

        this.setState({ selectedIntent }, this.fetchIntent)
    }

    fetchIntent = () => {
        const { startDate, endDate, filterBy: filterByLabel } = this.state.selectedIntent
        const filterBy = filterByLabel.value
        this.props.fetchIntent({ startDate, endDate, filterBy })
    }

    loadPreviousIntentStatusPage = () => {
        const { page } = this.state

        if (page && page > 0) {
            this.loadIntentStatusPage(page - 1)
        }
    }

    loadNextIntentStatusPage = () => {
        const { page = 0 } = this.state
        this.loadIntentStatusPage(page + 1)
    }

    loadIntentStatusPage = (page) => {
        this.setState({ page }, () => this.fetchIntentStatus())
    }

    fetchIntentStatus = () => {
        const { startDate, endDate, filterBy: filterByLabel, page } = this.state
        const filterBy = filterByLabel.value
        this.props.fetchIntentStatus({ startDate, endDate, filterBy, page }, () => {})
    }


    fetchIntentReports = () => {
        const { startDate, endDate, intents: intentLabels } = this.state.fetchIntentReport
        const intents = intentLabels.map(i => i.value)
        this.props.fetchIntentReports({ startDate, endDate, intents })
    }

    trainWatson = () => {
        this.setState(
            { isTraining: true },
            () => this.props.trainWatson(
                () => this.setState({ isTraining: false })
            )
        )
    }

    render() {
        const { user, counts, reports: conversationReports, intent: intentReports, intents: intentPercentageReports, intentStatus } = this.props
        const { isTraining, page, filterBy: intentStatusFilterBy } = this.state
        const conversationHourlyReports = _.get(this, 'props.conversationHourly.data.report')
        const intentList = this.props.intentList && this.props.intentList.data && this.props.intentList.data.intentsList || []
        const intentOptions = intentList.map((intent) => ({ label: intent, value: intent }))
        const chatbotType = _.get(this.props, 'typeId.name', '')
        const isSurveyBot = (chatbotType === 'Survey Bot')

        return (
            <div className="right_col" role="main">
                <TopTiles user={user} counts={counts} typeId={chatbotType} onDateRangeChange={this.onTopTilesDateRangeChange} />
                <div className="row">
                    <div className="col-md-6 col-sm-12 col-xs-12">
                        <ConversationsPanel
                            user={user}
                            reports={conversationReports}
                            onDateRangeChange={this.onConversationsPanelDateRangeChange}
                        />
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <Hourly
                            data={conversationHourlyReports}
                            onDateRangeChange={this.onHourlyPanelDateRangeChange}
                        />
                    </div>
                    {
                        !isSurveyBot && (
                            <div className="col-md-6 col-sm-12 col-xs-12">
                                <MessagesPanel
                                    user={user}
                                    reports={intentReports}
                                    intentOptions={intentOptions}
                                    onDateRangeChange={this.onMessagesPanelDateRangeChange}
                                    selectedIntent={this.state.selectedIntent.filterBy}
                                    selectIntent={this.selectIntent}
                                />
                            </div>
                        )
                    }
                    {
                        !isSurveyBot && (
                            <div className="col-md-6 col-sm-12 col-xs-12">
                                <IntentPercentagePanel
                                    user={this.props.user}
                                    reports={intentPercentageReports}
                                    intentOptions={intentOptions}
                                    onDateRangeChange={this.onIntentPercentagePanelDateRangeChange}
                                    selectedIntents={this.state.fetchIntentReport.intents}
                                    selectIntents={this.selectMultipleIntent}
                                />
                            </div>
                        )
                    }
                </div>
                <br />
                <div className="clearfix"></div>
                <br />
                <div className="clearfix"></div>
                {
                    !isSurveyBot && (
                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <IntentStatusPanel
                                    trainWatson={this.trainWatson}
                                    fetchIntentStatus={this.fetchIntentStatus}
                                    isTraining={isTraining}
                                    intentStatus={intentStatus}
                                    page={page}
                                    onPreviousPageClick={this.loadPreviousIntentStatusPage}
                                    onNextPageClick={this.loadNextIntentStatusPage}
                                    onDateRangeChange={this.onIntentStatusDateRangeChange}
                                    onSelectIntentStatusFilter={this.onSelectIntentStatusFilter}
                                    intentStatusFilter={intentStatusFilterBy}
                                />
                            </div>
                        </div>
                    )
                }
                <br />
                <br />
                <br />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: getUser(state),
    counts: getCounts(state),
    reports: getClientConversation(state),
    conversationHourly: getConversationHourly(state),
    intents: getIntents(state),
    ratings: getRatings(state),
    intentStatus: getIntentStatus(state),
    success: getSuccessfulIntents(state),
    failure: getFailureIntents(state),
    intentList: getIntentList(state),
    intent: getIntent(state),
    typeId: getBotType(state),
})

const mapDispatchToProps = (dispatch) => { // eslint-disable-line
    return {
        fetchCounts: (startDate, endDate) => {
            dispatch(fetchCounts(startDate, endDate))
        },
        fetchUserConversationReports: (data) => {
            dispatch(fetchUserConversationReports(data))
        },
        fetchIntentReports: (data) => {
            dispatch(fetchIntentReports(data))
        },
        fetchIntentStatus: (data, successFu) => {
            dispatch(fetchIntentStatus(data, successFu))
        },
        fetchSuccessfulIntents: (data) => {
            dispatch(fetchSuccessfulIntents(data))
        },
        fetchFailureIntents: (data) => {
            dispatch(fetchFailureIntents(data))
        },
        fetchIntentsList: () => {
            dispatch(fetchIntentsList())
        },
        fetchIntent: (data) => {
            dispatch(fetchIntent(data))
        },
        fetchRatings: (data) => {
            dispatch(fetchRatings(data))
        },
        fetchConversationHourly: (data) => {
            dispatch(fetchConversationHourly(data))
        },
        setCounts: (data) => {
            dispatch(setCounts(data))
        },
        setReport: (data) => {
            dispatch(setReport(data))
        },
        getChatbotById: () => {
            dispatch(getChatbotById())
        },
        trainWatson: (callbackFunc) => {
            dispatch(trainWatson(callbackFunc))
        },
    }
}

Home.propTypes = {
    user: PropTypes.object.isRequired,
    counts: PropTypes.object,
    chatbotIntents: PropTypes.object,
    reports: PropTypes.object.isRequired,
    conversationHourly: PropTypes.object.isRequired,
    intents: PropTypes.object.isRequired,
    intentStatus: PropTypes.object.isRequired,
    intent: PropTypes.object.isRequired,
    ratings: PropTypes.object.isRequired,
    success: PropTypes.object,
    failure: PropTypes.object,
    intentList: PropTypes.object.isRequired,
    fetchCounts: PropTypes.func.isRequired,
    fetchUserConversationReports: PropTypes.func.isRequired,
    fetchIntentReports: PropTypes.func.isRequired,
    fetchIntentStatus: PropTypes.func.isRequired,
    fetchIntentsList: PropTypes.func.isRequired,
    fetchIntent: PropTypes.func.isRequired,
    fetchRatings: PropTypes.func.isRequired,
    fetchConversationHourly: PropTypes.func.isRequired,
    fetchSuccessfulIntents: PropTypes.func.isRequired,
    fetchFailureIntents: PropTypes.func.isRequired,
    setCounts: PropTypes.func.isRequired,
    trainWatson: PropTypes.func.isRequired,
    setReport: PropTypes.func.isRequired,
    getChatbotById: PropTypes.func.isRequired,
    typeId: PropTypes.object.isRequired,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)