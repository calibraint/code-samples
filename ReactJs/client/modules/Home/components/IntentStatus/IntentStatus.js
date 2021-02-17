import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactPlaceholder from 'react-placeholder'
import { Modal, Button } from 'react-bootstrap'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getChatbotIntents } from '../../ReportsReducer'
import { insertExample, fetchChatbotIntents } from '../../ReportsActions'
import Notifications from 'react-notification-system-redux'
import TagsInput from 'react-tagsinput'

class IntentStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalShow: false,
            modalExample: '',
            modalIntent: '',
            exampleData: {},
            conversationId: '',
            title: '',
            tags: [],
            modalHeader: '',
            examplePlaceholder: { placeholder: 'Add examples' },
            isTraining: false,
        }
        this.clearValue = this.clearValue.bind(this)
    }

    UNSAFE_componentWillMount() {
        this.props.fetchChatbotIntents()
    }

    addExample() {
        const exampleData = {
            intentId: '',
            examples: [],
            conversationId: '',
        }
        exampleData.examples = this.state.tags.map(tag => ({ text: tag }))
        exampleData.intentId = _.get(_.find(this.props.chatbotIntents, { updatedIntent: this.state.modalIntent }), '_id', null)
        exampleData.conversationId = this.state.conversationId
        this.props.insertExample(exampleData, () => {
            this.clearValue()
            this.props.fetchIntentStatus()
        }, () => {})
    }
    clearValue() {
        this.setState(Object.assign({}, {
            modalShow: false,
            modalExample: '',
            modalIntent: '',
            exampleData: {},
            conversationId: '',
            tags: [],
            modalHeader: '',
        }))
    }

    handleAddition(tags) {
        if (tags.indexOf(this.state.modalExample) === -1) {
            tags.unshift(this.state.modalExample)
        }
        this.setState({ tags })
    }


    intentChange() {
        this.setState(Object.assign({}, {
            modalIntent: $('#select-intent option:selected').text(),
        }))
    }

    showIntentMapModal(intent, evt) {
        const tags = this.state.tags
        const newIntent = _.get(_.orderBy(this.props.chatbotIntents, intent => intent.updatedIntent.toLowerCase(), 'asc'), '[0].updatedIntent')
        tags.push(evt.target.name)
        this.props.fetchChatbotIntents()
        this.setState(Object.assign({}, {
            modalShow: true,
            modalExample: evt.target.name,
            modalIntent: !_.isEmpty(intent) ? intent : newIntent,
            conversationId: evt.target.id,
            tags,
            modalHeader: 'Map Intent',
        }))
    }

    showModal(intent, evt) {
        const tags = this.state.tags
        tags.push(evt.target.name)
        this.props.fetchChatbotIntents()
        this.setState(Object.assign({}, {
            modalShow: true,
            modalExample: evt.target.name,
            modalIntent: intent,
            conversationId: evt.target.id,
            tags,
            modalHeader: 'Add Examples',
        }))
    }

    trainWatson = () => {

    }

    render() {
        const { notifications } = this.props
        const placeholder = (
            <RectShape className="count animated-background" color="#f0f0f0" style={{ width: '100%', height: '250px' }} />
        )
        if (!this.props.intentStatus.loading) {
            return (
                <ReactPlaceholder ready={this.props.intentStatus.status === 'success'} customPlaceholder={placeholder}>
                    {
                        (this.props.intentStatus.data.intentsStatus && this.props.intentStatus.data.intentsStatus.length !== 0) ? (
                            <div>
                                <table id="example" className="table table-striped responsive-utilities jambo_table">
                                    <thead>
                                        <tr className="headings">
                                            <th>S.No </th>
                                            <th>Source</th>
                                            <th>TicketId</th>
                                            <th>Intent </th>
                                            <th>Confidence </th>
                                            <th>Status</th>
                                            <th>Input </th>
                                            <th></th>
                                            <th>Output </th>
                                            <th> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.intentStatus.data.intentsStatus.map((value, index) => (
                                                <tr key={index + 1} className={`${index % 2 === 0 ? 'even' : 'odd'} pointer`}>
                                                    <td>
                                                        {
                                                            (_.parseInt(_.get(this.props, 'intentStatus.data.page')) * 20) + (index + 1)
                                                        }
                                                    </td>
                                                    <td>{_.upperFirst(value.visitorType)}</td>
                                                    <td>{value.ticketId}</td>
                                                    <td>{!_.isEmpty(value.intent) ? value.intent : '_'}</td>
                                                    <td>{value.confidence != 0 ? _.round((value.confidence), 2).toFixed(2) : '_'}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <i className={value.confidence > 0.5 ? 'fa fa-check green' : 'fa fa-question orange'} />
                                                        <i className={value.transferred ? 'fa fa-paper-plane blue' : ''} />
                                                    </td>
                                                    <td>{value.input}</td>
                                                    <td>
                                                        {
                                                            value.newInput && value.confidence > 0.5 && !_.isEmpty(_.find(this.props.chatbotIntents, { updatedIntent: value.intent }))
                                                                ? <img id="new-icon" className="newIcon" src="../../assets/img/new.png" alt="" />
                                                                : ''
                                                        }
                                                    </td>
                                                    <td>{value.output}</td>
                                                    <td className="new-example">
                                                        {
                                                            (value.confidence !== 1 && value.newInput && value.confidence > 0.5 && !_.isEmpty(_.find(this.props.chatbotIntents, { updatedIntent: value.intent })))
                                                                ? <button
                                                                    className="btn btn-primary pull-left btn-intent-width p-l-sm"
                                                                    name={value.input}
                                                                    id={value.conversationId}
                                                                    onClick={this.showModal.bind(this, value.intent)}
                                                                >
                                                                        Add Example
                                                                </button>
                                                                : ''
                                                        }
                                                        {
                                                            (value.confidence < 0.5 && value.newInput && !_.isEmpty(_.get(this, 'props.chatbotIntents')))
                                                                ? <button className="btn btn-warning pull-left btn-intent-width" name={value.input} id={value.conversationId} onClick={this.showIntentMapModal.bind(this, value.intent)}>
                                                                        Map Intent
                                                                </button>
                                                                : ''
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <Modal className="modal-container" onHide={this.clearValue} show={this.state.modalShow} bsSize="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>{this.state.modalHeader}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="row m-md">
                                            <div className="col-md-12">
                                                <div className="col-md-3">
                                                    <label>Intent :</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <select
                                                        tabIndex="-1"
                                                        className="form-control"
                                                        id="select-intent"
                                                        value={this.state.modalIntent}
                                                        onChange={this.intentChange.bind(this)}
                                                    >
                                                        {
                                                            _.map(_.orderBy(this.props.chatbotIntents, intent => intent.updatedIntent.toLowerCase(), 'asc'), (currentIntent, key) => {
                                                                if (!_.isNull(_.get(currentIntent, 'updatedIntent', null))) {
                                                                    return <option key={key + 1} value={_.get(currentIntent, 'updatedIntent', null)}>{_.get(currentIntent, 'updatedIntent', null)}</option>
                                                                }
                                                                return ''
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row m-md">
                                            <div className="col-md-12">
                                                <div className="col-md-3">
                                                    <label>Add Examples :</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TagsInput
                                                        value={this.state.tags}
                                                        onChange={this.handleAddition.bind(this)}
                                                        onlyUnique
                                                        inputProps={this.state.examplePlaceholder}
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
                                            onClick={this.addExample.bind(this)}
                                        >Add Example
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Notifications notifications={notifications} />
                            </div>

                        )
                            : (<h2 style={{ textAlign: 'center' }}>No Intents for this time period.</h2>)
                    }
                </ReactPlaceholder>

            )
        } else if (this.props.intentStatus.success === 'fail') {
            return <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>Something went wrong...</h2>
        }
        return <h2 style={{ textAlign: 'center', lineHeight: '250px' }}>Loading...</h2>
    }
}

IntentStatus.propTypes = {
    intentStatus: PropTypes.object.isRequired,
    chatbotIntents: PropTypes.array.isRequired,
    insertExample: PropTypes.func.isRequired,
    notifications: PropTypes.array,
    fetchChatbotIntents: PropTypes.func.isRequired,
    fetchIntentStatus: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => { // eslint-disable-line
    return {
        chatbotIntents: getChatbotIntents(state),
        notifications: state.notifications,
    }
}
const mapDispatchToProps = (dispatch) => { // eslint-disable-line
    return {
        insertExample: (data, successFn, errorFn) => {
            dispatch(insertExample(data, successFn, errorFn))
        },
        fetchChatbotIntents: () => {
            dispatch(fetchChatbotIntents())
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IntentStatus)