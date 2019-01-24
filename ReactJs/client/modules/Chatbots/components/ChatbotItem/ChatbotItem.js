import PropTypes from 'prop-types'
import React, { Component } from 'react'
import * as _ from 'lodash'
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { error } from 'react-notification-system-redux'
const notificationOpts = {
    title: 'File',
    message: 'Please choose json file!',
    position: 'tr',
    autoDismiss: 2,
}
export class ChatbotItem extends Component {

    constructor() {
        super()
        this.state = {
            showPlanUpgradeModal: false,
            showImportModal: false,
            languageArray: {
                en: 'English (en)',
                nl: 'Dutch (nl)',
                fr: 'French (fr)',
                de: 'German (de)',
            },
        }
        this.clearValue = this.clearValue.bind(this)
    }

    UNSAFE_componentWillMount() {

    }

    clearValue() {
        this.setState(Object.assign({}, {
            showPlanUpgradeModal: false,
        }))
    }

    closeImportModal() {
        this.setState(Object.assign({}, this.state, {
            showImportModal: false,
        }))
    }

    exportIntentEntity() {
        const chatbotId = _.get(this.props, 'chatbot.chatbotId')
        const data = {
            export: {
                intent: true,
                entity: true,
                isFew: false,
                ids: [],
            },
            chatbotId,
        }
        this.props.exportIntentEntity(data, (res) => {
            const url = _.get(res, 'url', '')
            downloadFile(url)
        }, () => {
        })
    }

    handleFile(e) {
        const reader = new FileReader()
        const file = e.target.files[0]
        if (!file) {
            return
        }
        if (file.size === 0) {
            notificationOpts.message = 'Invalid json data'
            this.context.store.dispatch(
                error(notificationOpts)
            )
        }
        const fileString = /^.+\.([^.]+)$/.exec(file.name)
        const fileType = !_.isEmpty(fileString) ? fileString[1] : ''
        if (fileType === 'json') {
            reader.onload = ((fileData) => {
                let jsonData
                notificationOpts.message = 'Invalid json data'
                try {
                    jsonData = JSON.parse(fileData.target.result)
                    this.setState(Object.assign({}, this.state, {
                        jsonData,
                    }))
                    this.context.store.dispatch(
                        error(notificationOpts)
                    )
                } catch (err) {
                    return this.context.store.dispatch(
                        error(notificationOpts)
                    )
                }
                return ''
            })
            reader.readAsText(file)
        } else {
            notificationOpts.message = 'Please choose json file'
            this.context.store.dispatch(
                error(notificationOpts)
            )
        }
    }

    handleOnClickDelete = (event) => {
        event.preventDefault()
        const chatbotId = _.get(this.props, 'chatbot.chatbotId')
        this.props.showDeleteChatbot(chatbotId)
    }

    handleOnClickEdit = (event) => {
        event.preventDefault()
        const chatbotId = _.get(this.props, 'chatbot.chatbotId')
        this.props.editChatbot(chatbotId)
    }

    importIntentEntity() {
        const data = {
            export: {
                intent: true,
                entity: true,
                isAppend: (this.props.selectedImportType === 'append'),
            },
            jsonData: this.state.jsonData,
            chatbotId: this.props.chatbotId,
        }
        this.setState(Object.assign({}, this.state, {
            isDisable: true,
        }), () => {
            this.props.importIntentEntity(data, () => {
                this.setState(Object.assign({}, this.state, {
                    isDisable: false,
                }))
            }, () => {
                this.setState(Object.assign({}, this.state, {
                    isDisable: false,
                }))
            })
        })
    }

    loadRoute() {
        this.props.saveAppDetails(this.props.chatbot.clientId, this.props.chatbot.chatbotId, this.props.chatbot.name, this.props.chatbot.typeId.name, this.props.chatbot.isTrained)
    }

    openFileUploader() {
        this.closeImportModal()
    }

    showImportModal() {
        this.props.changeImportType('erase', _.get(this.props, 'chatbot.chatbotId', null))
        this.setState(Object.assign({}, this.state, {
            showImportModal: true,
        }))
    }
    showPlanUpgradeModal() {
        this.setState(Object.assign({}, {
            showPlanUpgradeModal: true,
        }))
    }

    render() {
        return (
            <div className="col-md-4 col-sm-4 col-xs-12 animated fadeInDown" >
                <div className="well profile_view cursor_hand" style={{ minHeight: '148px', maxHeight: '180px', cursor: 'default' }}>
                    <div className="col-sm-12">
                        {!_.get(this.props, 'isPaid', true) && _.get(this.props, 'paymentMode', true)
                            ? '' : <ul className="nav navbar-right panel_toolbox" style={{ marginRight: '-42px', marginTop: '6px' }}>
                                <li className="dropdown">
                                    <a
                                        className="dropdown-toggle"
                                        data-toggle="dropdown"
                                        role="button"
                                        aria-expanded="false"
                                    ><i className="fa fa-ellipsis-h" style={{ fontSize: '18px' }}></i>
                                    </a>
                                    <ul className="dropdown-menu" role="menu" style={{ borderTop: '0px', marginTop: '-9px', paddingBottom: '0px' }}>
                                        <li style={{ padding: '3px' }} onClick={this.handleOnClickEdit}>
                                            <a>Edit </a>
                                        </li>
                                        <li style={{ padding: '3px' }} onClick={(this.props.plan === 'Free' && this.props.paymentMode) ? this.showPlanUpgradeModal.bind(this) : this.handleOnClickDelete}>
                                            <a>Delete </a>
                                        </li>
                                        {
                                            (this.props.chatbot.typeId.name === 'CUSTOM')
                                                ? <li style={{ padding: '3px' }} onClick={this.exportIntentEntity.bind(this)}><a>Export (Intent & Entity) </a>
                                                </li> : ''
                                        }
                                        {
                                            (this.props.chatbot.typeId.name === 'CUSTOM')
                                                ? <li style={{ padding: '3px' }} onClick={this.showImportModal.bind(this)}><a>Import (Intent & Entity) </a>
                                                </li> : ''
                                        }
                                        <input
                                            type="file"
                                            id="fileupload"
                                            accept=".json"
                                            className="d-none"
                                            onChange={this.handleFile.bind(this)}
                                            onClick={(event) => {
                                                const evt = event
                                                evt.target.value = null
                                            }}
                                        />
                                    </ul>
                                </li>
                            </ul>
                        }
                        <div onClick={this.loadRoute.bind(this)} style={{ cursor: 'pointer' }}>
                            <div className="col-sm-12 no-padding no-margin m-b-xs">
                                <h4 className="col-sm-3 no-padding no-margin text_transform_capitalize"><strong>Name</strong></h4>
                                <h4 className="col-sm-1 no-padding no-margin"><strong>:</strong></h4>
                                <h4 className="col-sm-8 no-padding no-margin text_transform_capitalize">{this.props.chatbot.name.toLowerCase()}</h4>
                                <input type="text" value={this.props.chatbot.chatbotId} hidden />
                            </div>
                            <div className="col-sm-12 no-padding no-margin m-b-xs">
                                <h4 className="col-sm-3 no-padding no-margin text_transform_capitalize"><strong>Type</strong></h4>
                                <h4 className="col-sm-1 no-padding no-margin"><strong>:</strong></h4>
                                <h4 className="col-sm-8 no-padding no-margin text_transform_capitalize">{_.get(this.props, 'chatbot.typeId.name', 'Other') === 'FAQ' ? 'FAQ' : _.get(this.props, 'chatbot.typeId.name', 'Other').toLowerCase()}</h4>
                            </div>
                            {
                                _.get(this.props, 'chatbot.typeId.name', '') === 'Survey Bot'
                                    ? <div className="col-sm-12 no-padding no-margin m-b-xs">
                                        <h4 className="col-sm-3 no-padding no-margin text_transform_capitalize"><strong>Project No</strong></h4>
                                        <h4 className="col-sm-1 no-padding no-margin"><strong>:</strong></h4>
                                        <h4 className="col-sm-8 no-padding no-margin text_transform_uppercase">{!_.isEmpty(_.get(this.props, 'chatbot.projectNo', '')) ? _.get(this.props, 'chatbot.projectNo', '') : '-'}</h4>
                                    </div> : ''
                            }
                            {
                                _.get(this.props, 'chatbot.typeId.name', '') === 'CUSTOM'
                                    ? <div className="col-sm-12 no-padding no-margin m-b-xs">
                                        <h4 className="col-sm-3 no-padding no-margin text_transform_capitalize"><strong>Language</strong></h4>
                                        <h4 className="col-sm-1 no-padding no-margin"><strong>:</strong></h4>
                                        <h4 className="col-sm-8 no-padding no-margin">{!_.isEmpty(_.get(this.props, 'chatbot.language', '')) ? this.state.languageArray[_.get(this.props, 'chatbot.language', '')] : '-'}</h4>
                                    </div> : ''
                            }
                            <div className="col-sm-12 no-padding no-margin m-b-xs">
                                <h4 className="col-sm-3 no-padding no-margin text_transform_capitalize"><strong>About</strong></h4>
                                <h4 className="col-sm-1 no-padding no-margin"><strong>:</strong></h4>
                                <h4 className="col-sm-8 no-padding no-margin">{_.upperFirst(this.props.chatbot.description)}</h4>
                            </div>
                            <div className="pull-right status">
                                {
                                    this.props.chatbot.isActive
                                        ? <i className="fa fa-circle on" aria-hidden="true"> <span> Enabled</span></i>
                                        : <i className="fa fa-circle off" aria-hidden="false"> <span> Disabled</span></i>
                                }
                            </div>
                        </div>
                    </div>
                </div>
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
                        <p>You do not have privilege to do this action in free plan, please upgrade plan</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.clearValue}>Close</Button>
                        <Link id="paymentli" to={`/payments/${this.props.chatbot.clientId}`} >
                            <button type="button" className="btn btn-primary pull-right">
                                Upgrade
                            </button>
                        </Link>
                    </Modal.Footer>
                </Modal>
                <Modal
                    className="modal-container"
                    show={this.state.showImportModal}
                    onHide={this.closeImportModal.bind(this)}
                    bsSize="small"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Import</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Import Options:
                            <div className="radio">
                                <label>
                                    <input
                                        id="eraseImport"
                                        name="import"
                                        type="radio"
                                        value="erase"
                                        checked={this.props.selectedImportType === 'erase'}
                                        onChange={() => this.props.changeImportType('erase', _.get(this.props, 'chatbot.chatbotId', null))}
                                    />
                                    Erase everything and import
                                </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input
                                        id="appendImport"
                                        name="import"
                                        type="radio"
                                        value="append"
                                        checked={this.props.selectedImportType === 'append'}
                                        onChange={() => this.props.changeImportType('append', _.get(this.props, 'chatbot.chatbotId', null))}
                                    />
                                    Append without erasing the existing data
                                </label>
                            </div><br />
                            Are you sure you want to Import?
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button id="closeButton" onClick={this.closeImportModal.bind(this)}>Close</Button>
                        <Button id="deleteModalButton" bsStyle="primary" onClick={this.openFileUploader.bind(this)}>Import</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}


ChatbotItem.propTypes = {
    chatbot: PropTypes.object.isRequired,
    plan: PropTypes.string.isRequired,
    isPaid: PropTypes.bool.isRequired,
    saveAppDetails: PropTypes.func.isRequired,
    editChatbot: PropTypes.func.isRequired,
    showDeleteChatbot: PropTypes.func.isRequired,
    exportIntentEntity: PropTypes.func.isRequired,
    importIntentEntity: PropTypes.func.isRequired,
    changeImportType: PropTypes.func.isRequired,
    selectedImportType: PropTypes.string.isRequired,
    chatbotId: PropTypes.string,
    paymentMode: PropTypes.bool.isRequired,
}
ChatbotItem.contextTypes = {
    store: PropTypes.object,
}

export default ChatbotItem
