import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { getProfile } from '../Profile/ProfileReducer'
import { connect } from 'react-redux'
import { ChatbotItem } from './components/ChatbotItem/ChatbotItem'
import { getChatbots, initialState } from './ChatbotsReducer'
import { getSectors, getChatbotTypes } from './SectorsReducer'
import { getClientId } from '../App/AppReducer'
import { getSelectedClient } from '../Clients/ClientsReducer'
import { setClientId, setBotId, setBotName, setClientName, getUser } from '../App/AppActions'
import { getClientById } from '../Clients/ClientsActions'
import { fetchChatbots, createChatbot, getChatbotById, updateChatbot, deleteChatbot, setChatbots } from './ChatbotsActions'
import { exportData, importIntentEntity } from '../ConfigureBot/ConfigureBotActions'
import { fetchSectors, fetchChatbotTypes } from './SectorsActions'
import * as _ from 'lodash'
import Toggle from 'react-bootstrap-toggle'
import { Modal, Button } from 'react-bootstrap'
import Notifications from 'react-notification-system-redux'
import { Link } from 'react-router-dom'

class Chatbots extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            name: '',
            sector: null,
            type: '',
            projectNo: '',
            botType: '',
            description: '',
            edit: false,
            error: '',
            success: '',
            botStatus: false,
            showModal: false,
            showDeleteModal: false,
            newChatbotTypes: [],
            isLimitExceeded: false,
            showPlanUpgradeModal: false,
            selectedImportType: 'erase',
            chatbotId: null,
            searchName: '',
            filterType: '',
            language: '',
        }
        this.clearValue = this.clearValue.bind(this)
        this.validateChatbotCount = this.validateChatbotCount.bind(this)
    }

    componentWillUnmount() {
        this.props.setChatbots(initialState.chatbots)
    }

    UNSAFE_componentWillMount() {
        this.props.fetchChatbots({})
        this.props.fetchSectors()
        this.props.fetchChatbotTypes()
        this.validateChatbotCount(this)
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState(Object.assign({}, {
            newChatbotTypes: props.types.types,
        }), () => {
            this.validateChatbotCount()
        })
    }

    botChangeSwitch() {
        this.setState({ botStatus: !this.state.botStatus })
    }

    changeImportType(value, id) {
        this.setState(Object.assign({}, this.state, {
            selectedImportType: value,
            chatbotId: id,
        }))
    }

    onSearchBotKeyPress = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const chatbots = _.flatten(Object.values(this.props.chatbots))
            const chatbot = chatbots[0]
            if (chatbot) {
                this.saveAppDetails(chatbot.clientId, chatbot.chatbotId, chatbot.name, chatbot.typeId.name, chatbot.isTrained)
            }
        }
    }

    clearValue() {
        this.setState(Object.assign({}, this.state, {
            edit: false,
            showDeleteModal: false,
            showModal: false,
            error: '',
            name: '',
            botType: '',
            filterType: '',
            botStatus: false,
            description: '',
            sector: '',
            projectNo: '',
            showPlanUpgradeModal: false,
        }))
    }

    handleChange(evt) {
        let botType
        if (evt.target.id === 'type') {
            const typeData = _.find(this.props.sectors.types, { _id: evt.target.value }) || {}
            botType = _.get(typeData, 'name', '')
        }
        switch (evt.target.id) {
        case 'name':
            this.setState(Object.assign({}, this.state, {
                name: evt.target.value,
            }))
            break
        case 'description':
            this.setState(Object.assign({}, this.state, {
                description: evt.target.value,
            }))
            break
        case 'sector':
            this.setState(Object.assign({}, this.state, {
                sector: (evt.target.value === 'Select a Sector') ? null : evt.target.value,
            }))
            break
        case 'type':
            this.setState(Object.assign({}, this.state, {
                type: evt.target.value,
                botType,
            }))
            break
        case 'projectNo':
            this.setState(Object.assign({}, this.state, {
                projectNo: _.trim(evt.target.value),
            }))
            break
        case 'searchBot':
            this.setState(Object.assign({}, this.state, {
                searchName: evt.target.value,
            }))
            this.props.fetchChatbots({
                name: evt.target.value,
                type: '',
            })
            break
        case 'language':
            this.setState(Object.assign({}, this.state, {
                language: evt.target.value,
            }))
            break
        default:
            break
        }
    }

    createChatbot() {
        this.setState(Object.assign({}, {
            error: '',
        }))
        this.props.createChatbot({
            name: this.state.name,
            description: this.state.description,
            sectorId: this.state.sector,
            typeId: this.state.type,
            projectNo: _.trim(this.state.projectNo),
            language: _.isEmpty(this.state.language) ? 'en' : this.state.language,
        }, () => {
            this.clearValue()
            this.setState(Object.assign({}, {
                name: '',
                description: '',
                sector: '',
                type: '',
                projectNo: '',
                botType: '',
                language: '',
            }))
        }, (err) => {
            if (_.isUndefined(err.status)) {
                this.setState(Object.assign({}, {
                    error: 'Something went wrong',
                }))
            } else if (err.status === 'fail') {
                this.setState(Object.assign({}, {
                    error: err.message,
                }))
            }
        })
    }

    deleteChatbot() {
        this.setState(Object.assign({}, {
            error: '',
        }))
        this.props.deleteChatbot({
            id: this.state.id,
        }, () => {
            this.clearValue()
        }, (err) => {
            if (_.isUndefined(err.status)) {
                this.setState(Object.assign({}, {
                    error: 'Something went wrong',
                }))
            } else if (err.status === 'fail') {
                this.setState(Object.assign({}, {
                    error: err.message,
                }))
            }
        })
    }

    editChatbot(id) {
        this.clearValue()
        this.props.getChatbotById({
            id,
        }, (res) => {
            if (!_.isUndefined(res.status) && res.status === 'success') {
                const data = res.data
                this.setState(Object.assign({}, {
                    name: data.name,
                    description: data.description,
                    sector: _.get(data, 'sectorId._id', null),
                    id: data.chatbotId,
                    botStatus: data.isActive,
                    projectNo: data.projectNo,
                    edit: true,
                    showModal: true,
                }))
            }
        }, (err) => {
            if (_.isUndefined(err.status)) {
                this.setState(Object.assign({}, {
                    error: 'Something went wrong',
                }))
            } else if (err.status === 'fail') {
                this.setState(Object.assign({}, {
                    error: err.message,
                }))
            }
        })
    }

    handleClick(event) {
        let botType = ''
        let filter = event.target.id
        switch (event.target.id) {
        case 'watson':
            botType = _.find(_.get(this.props, 'sectors.types', []), { name: 'Watson' }) || {}
            break
        case 'faq':
            botType = _.find(_.get(this.props, 'sectors.types', []), { name: 'FAQ' }) || {}
            break
        case 'survey':
            botType = _.find(_.get(this.props, 'sectors.types', []), { name: 'Survey Bot' }) || {}
            break
        case 'leadgenerator':
            botType = _.find(_.get(this.props, 'sectors.types', []), { name: 'Leadgenerator' }) || {}
            break
        case 'custom':
            botType = _.find(_.get(this.props, 'sectors.types', []), { name: 'CUSTOM' }) || {}
            break
        case 'all':
        default:
            filter = ''
            break
        }
        this.setState(Object.assign({}, this.state, {
            filterType: filter,
        }))
        this.props.fetchChatbots({
            name: this.state.searchName,
            type: _.get(botType, '_id', ''),
        })
    }

    saveAppDetails(clientId, botId, name, typeId, isTrained) {
        this.props.setBotId(botId)
        this.props.setClientId(clientId)
        this.props.setBotName(name, typeId, isTrained)
        if (!_.get(this.props, 'profile.isPaid', true) && _.get(this.props, 'profile.paymentMode', true)) {
            this.props.history.push(`/payments/${clientId}`)
        } else {
            this.props.history.push(`/dashboard/${clientId}/${botId}`)
        }
    }

    showDeleteChatbot(id) {
        this.clearValue()
        this.setState(Object.assign({}, {
            id,
            showDeleteModal: true,
        }))
    }

    showModalPopup() {
        this.clearValue()
        this.setState({ showModal: true })
    }

    showPlanUpgradeModal() {
        this.setState(Object.assign({}, {
            showPlanUpgradeModal: true,
        }))
    }

    updateChatbot() {
        if (this.state.name === '') {
            this.setState(Object.assign({}, {
                error: 'Please enter all details',
            }))
        } else {
            this.setState(Object.assign({}, {
                error: '',
            }))
            this.props.updateChatbot({
                name: this.state.name,
                description: this.state.description,
                id: this.state.id,
                projectNo: this.state.projectNo,
                isActive: this.state.botStatus,
            }, () => {
                this.clearValue()
            }, (err) => {
                if (_.isUndefined(err.status)) {
                    this.setState(Object.assign({}, {
                        error: 'Something went wrong',
                    }))
                } else if (err.status === 'fail') {
                    this.setState(Object.assign({}, {
                        error: err.message,
                    }))
                }
            })
        }
    }

    validateChatbotCount() {
        if (_.get(this.props, 'profile.paymentMode', true) && _.get(this.props, 'profile.plan', 'Premium') === 'Free') {
            const availableTypes = []
            _.map(this.props.chatbots, (data) => {
                if (!_.isEmpty(data)) {
                    availableTypes.push(data[0].typeId.name)
                }
            })
            const newChatbotTypes = _.filter(this.props.sectors.types, (elem) => !_.includes(availableTypes, elem.name))
            this.setState(Object.assign({}, {
                newChatbotTypes,
                isLimitExceeded: (_.isEmpty(newChatbotTypes)),
            }))
        }
    }

    render() {
        const { notifications } = this.props
        return (
            <div className="right_col" style={{ height: 'calc( 100vh - 45px)' }} >
                <div className="row">
                    <div className="col-md-12">
                        <div className="x_panel">
                            <div className="row x_title">
                                <div className="col-md-12">
                                    <h2>Chatbots<small>List of Chatbots</small></h2>
                                    {
                                        (!_.get(this.props, 'profile.isPaid', true) && _.get(this.props, 'profile.paymentMode', true))
                                            ? ''
                                            : <button
                                                type="button"
                                                className="btn btn-primary pull-right"
                                                onClick={(this.state.isLimitExceeded) ? this.showPlanUpgradeModal.bind(this) : this.showModalPopup.bind(this)}
                                            >
                                            Create a new Chatbot
                                            </button>
                                    }
                                    <div className="col-md-1 pull-right">
                                        <div className="dropdown chatbot-intent-filter">
                                            <span className="dropdown-toggle" data-toggle="dropdown">
                                                <i className="fa fa-filter filter-search"></i>
                                            </span>
                                            <ul className="dropdown-menu">
                                                <li><a  className={this.state.filterType === '' ? 'selectedValue' : ''} id="all" onClick={this.handleClick.bind(this)}>All</a></li>
                                                <li><a  className={this.state.filterType === 'watson' ? 'selectedValue' : ''} id="watson" onClick={this.handleClick.bind(this)}>Watson</a></li>
                                                <li><a  className={this.state.filterType === 'faq' ? 'selectedValue' : ''} id="faq" onClick={this.handleClick.bind(this)}>FAQ</a></li>
                                                <li><a  className={this.state.filterType === 'survey' ? 'selectedValue' : ''} id="survey" onClick={this.handleClick.bind(this)}>Survey</a></li>
                                                <li><a  className={this.state.filterType === 'custom' ? 'selectedValue' : ''} id="custom" onClick={this.handleClick.bind(this)}>Custom</a></li>
                                                <li><a  className={this.state.filterType === 'leadgenerator' ? 'selectedValue' : ''} id="leadgenerator" onClick={this.handleClick.bind(this)}>Leadgenerator</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-3 pull-right">
                                        <div className="chatbot-filter">
                                            <input
                                                id="searchBot"
                                                type="text"
                                                className="col-md-8 search-text-box"
                                                placeholder="Search by name"
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.searchName}
                                                style={{ fontSize: '14px' }}
                                                onKeyPress={this.onSearchBotKeyPress}
                                                autoFocus
                                            />
                                            <span className="filter-search">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="x_content">

                                <div className="row">
                                    {
                                        _.map(_.get(this.props, 'chatbots', {}), (data, key) => (
                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                {!_.isEmpty(data) ? <div><h2 className="p-l-xs"> {key === 'faq' ? 'FAQ' : _.capitalize(key)} </h2><hr /></div> : ''}
                                                {
                                                    data.map((bot, index) => (
                                                        <ChatbotItem
                                                            key={index}
                                                            chatbot={bot}
                                                            param={this.props.params}
                                                            saveAppDetails={this.saveAppDetails.bind(this)}
                                                            editChatbot={this.editChatbot.bind(this)}
                                                            showDeleteChatbot={this.showDeleteChatbot.bind(this)}
                                                            plan={_.get(this.props, 'profile.plan', 'Premium')}
                                                            isPaid={_.get(this.props, 'profile.isPaid', true)}
                                                            paymentMode={_.get(this.props, 'profile.paymentMode', true)}
                                                            exportIntentEntity={this.props.exportIntentEntity}
                                                            importIntentEntity={this.props.importIntentEntity}
                                                            selectedImportType={this.state.selectedImportType}
                                                            chatbotId={this.state.chatbotId}
                                                            changeImportType={this.changeImportType.bind(this)}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    className="modal-container"
                    show={this.state.showModal}
                    onHide={this.clearValue}
                    bsSize="small"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.edit ? 'Edit Chatbot' : 'Create a New Chatbot'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="red text-center">{this.state.error}</p>
                        <label htmlFor="name">Name * :</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            name="name"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.name}
                            required
                        />
                        <label htmlFor="message" className="m-t-sm">Description :</label>
                        <textarea
                            id="description"
                            className="form-control"
                            name="description"
                            onChange={this.handleChange.bind(this)}
                            value={this.state.description}
                            maxLength="100"
                        >
                        </textarea>
                        <div hidden={this.state.edit} >
                            <label htmlFor="sector" className="m-t-sm">Sector  :</label>
                            <select
                                className="select2_single form-control"
                                id="sector"
                                onChange={this.handleChange.bind(this)}
                            >
                                <option selected>Select a Sector</option>
                                {
                                    this.props.sectors.sectors !== undefined
                                        ? this.props.sectors.sectors.map((index) => <option value={index._id} > {index.sector}</option>)
                                        : ''
                                }
                            </select>
                            <label htmlFor="type" className="m-t-sm">Bot Type * :</label>
                            <select
                                className="select2_single form-control"
                                id="type"
                                onChange={this.handleChange.bind(this)}
                            >
                                <option selected="Select a Chatbot Type" disabled>Select a Chatbot Type</option>
                                {
                                    _.get(this.state, 'newChatbotTypes', []).map((index) => <option value={index._id} name={index.name} > {index.name}</option>)
                                }
                            </select>
                            {
                                (this.state.botType === 'Survey Bot')
                                    ? <span>
                                        <label htmlFor="project">Project No * :</label>
                                        <input
                                            type="text"
                                            id="projectNo"
                                            className="form-control"
                                            name="project"
                                            onChange={this.handleChange.bind(this)}
                                            value={this.state.projectNo}
                                            required
                                        />
                                    </span> : ''
                            }
                            {
                                (this.state.botType === 'CUSTOM')
                                    ? <span>
                                        <label htmlFor="type" className="m-t-sm">Language :</label>
                                        <select
                                            className="select2_single form-control"
                                            id="language"
                                            onChange={this.handleChange.bind(this)}
                                        >
                                            <option selected="Select a Chatbot Type" disabled>Select a Language</option>
                                            <option value="en">English (en)</option>
                                            <option value="nl" >Dutch (nl)</option>
                                            <option value="fr">French (fr)</option>
                                            <option value="de">German (de)</option>
                                        </select>
                                    </span> : ''
                            }
                        </div>
                        <div className="m-t-sm" hidden={!this.state.edit}>
                            <div
                                className="form-control"
                                style={{ border: 'none', borderStyle: 'none', boxShadow: 'none', padding: '0px', marginBottom: '-9px' }}
                            >
                                <label
                                    className="control-label col-md-6 col-sm-3 col-xs-12"
                                    style={{ margin: '0px', padding: '0px', color: '#73879C', fontSize: '13px', fontWeight: '700' }}
                                >Chatbot Status
                                </label>
                                <div className="pull-right status">
                                    <Toggle
                                        on={<h5>Enabled</h5>}
                                        off={<h5>Disabled</h5>}
                                        size="xs"
                                        offstyle="danger"
                                        active={this.state.botStatus}
                                        onClick={this.botChangeSwitch.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.clearValue}>Close</Button>
                        <Button
                            id="createModalButton"
                            bsStyle="primary"
                            onClick={this.state.edit ? this.updateChatbot.bind(this) : this.createChatbot.bind(this)}
                        >{this.state.edit ? 'Update Chatbot' : 'Create Chatbot'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    className="modal-container"
                    show={this.state.showDeleteModal}
                    onHide={this.clearValue}
                    bsSize="small"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Chatbot</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p> Are you sure you want to delete this chatbot?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.clearValue}>Close</Button>
                        <Button id="deleteModalButton" bsStyle="primary" onClick={this.deleteChatbot.bind(this)}>Delete Chatbot</Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    className="modal-container"
                    show={this.state.showPlanUpgradeModal}
                    onHide={this.clearValue}
                    bsSize="small"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Upgrade Plan</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p> You do not have privilege to do this action in free plan, please upgrade plan</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.clearValue}>Close</Button>
                        <Link id="paymentli" to={`/payments/${this.props.clientId}`} >
                            <button type="button" className="btn btn-primary pull-right">
                                Upgrade
                            </button>
                        </Link>
                    </Modal.Footer>
                </Modal>
                <Notifications
                    notifications={notifications}
                />
            </div>)
    }
}

const mapStateToProps = (state) => ({
    chatbots: getChatbots(state),
    sectors: getSectors(state),
    types: getChatbotTypes(state),
    notifications: state.notifications,
    profile: getProfile(state),
    clientId: getClientId(state),
    clientData: getSelectedClient(state),
})

const mapDispatchToProps = (dispatch) => ({
    fetchChatbots: (data) => {
        dispatch(fetchChatbots(data))
    },
    fetchSectors: () => {
        dispatch(fetchSectors())
    },
    fetchChatbotTypes: () => {
        dispatch(fetchChatbotTypes())
    },
    createChatbot: (data, successFn, errorFn) => {
        dispatch(createChatbot(data, successFn, errorFn))
    },
    getChatbotById: (data, successFn, errorFn) => {
        dispatch(getChatbotById(data, successFn, errorFn))
    },
    updateChatbot: (data, successFn, errorFn) => {
        dispatch(updateChatbot(data, successFn, errorFn))
    },
    deleteChatbot: (data, successFn, errorFn) => {
        dispatch(deleteChatbot(data, successFn, errorFn))
    },
    setBotId: (botId) => {
        dispatch(setBotId(botId))
    },
    setClientId: (clientId) => {
        dispatch(setClientId(clientId))
    },
    setBotName: (name, typeId, isTrained) => {
        dispatch(setBotName(name, typeId, isTrained))
    },
    getUser: (role) => {
        dispatch(getUser(role))
    },
    setClientName: (clientName) => {
        dispatch(setClientName(clientName))
    },
    getChatbots: (data) => {
        dispatch(getChatbots(data))
    },
    setChatbots: (data) => {
        dispatch(setChatbots(data))
    },
    exportIntentEntity: (data, successFn, errorFn) => {
        dispatch(exportData(data, successFn, errorFn))
    },
    importIntentEntity: (data, successFn, errorFn) => {
        dispatch(importIntentEntity(data, successFn, errorFn))
    },
    getClientById: (data, successFn, errorFn) => {
        dispatch(getClientById(data, successFn, errorFn))
    },
})

Chatbots.propTypes = {
    chatbots: PropTypes.object.isRequired,
    sectors: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    clientId: PropTypes.string.isRequired,
    clientData: PropTypes.object.isRequired,
    fetchChatbots: PropTypes.func.isRequired,
    fetchSectors: PropTypes.func.isRequired,
    fetchChatbotTypes: PropTypes.func.isRequired,
    createChatbot: PropTypes.func.isRequired,
    setBotId: PropTypes.func.isRequired,
    setClientId: PropTypes.func.isRequired,
    setClientName: PropTypes.func.isRequired,
    setBotName: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    getChatbotById: PropTypes.func.isRequired,
    updateChatbot: PropTypes.func.isRequired,
    deleteChatbot: PropTypes.func.isRequired,
    getChatbots: PropTypes.func.isRequired,
    notifications: PropTypes.array,
    setChatbots: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    exportIntentEntity: PropTypes.func.isRequired,
    importIntentEntity: PropTypes.func.isRequired,
    getClientById: PropTypes.func.isRequired,
}

Chatbots.contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chatbots)
