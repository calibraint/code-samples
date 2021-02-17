import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import * as _ from 'lodash'

export function Header(props, context) { // eslint-disable-line
    let headerPage
    const clientsList = (
        <li className="chatbots">
            <Link id="clientsli" to={'/clients'}>Clients </Link>
        </li>
    )
    const chatbotsList = (
        <li className="chatbots">
            <Link className="chatbotsclients active" id="chatbotsli" to={`/chatbots/${props.clientId}`}>{`${props.clientName} Chatbots`} </Link>
        </li>
    )
    let superAdminClients = (props.user.role === 'SUPERADMIN' ? clientsList : null)
    const clients = (
        <ul id="clients" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            <li className="clients">Clients</li>
        </ul>
    )
    const paymentSettings = (
        <ul id="paymentSettings" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            <li className="paymentSettings">Payment Settings</li>
        </ul>
    )
    const chatbots = (
        <ul id="chatbots" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            <li>{`${props.clientName} Chatbots`}</li>
        </ul>
    )
    const dashboard = (
        <ul id="dashboard" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> Home`} </li>
        </ul>
    )
    const history = (
        <ul id="history" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> History`}</li>
        </ul>
    )
    const summary = (
        <ul id="summary" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> Summary`}</li>
        </ul>
    )
    const settings = (
        <ul id="settings" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> Settings`} </li>
        </ul>
    )
    const employees = (
        <ul id="employees" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            <li>{props.clientName} Employees</li>
        </ul>
    )

    const intents = (
        <ul id="intents" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> Intents`} </li>
        </ul>
    )

    const configure = (
        <ul id="configure" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> Flow`} </li>
        </ul>
    )

    const surveyBot = (
        <ul id="surveyBot" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            {chatbotsList}
            <li>{`${props.botName.name} ~> Survey`} </li>
        </ul>
    )

    const payments = (
        <ul id="payments" className="breadcrumb" style={{ paddingLeft: '21px' }}>
            <small>You are here: </small>
            {superAdminClients}
            <li>{props.clientName} Payments</li>
        </ul>
    )

    const superAdminPage = [ clients, chatbots, settings, dashboard, history, summary, employees, intents, configure, surveyBot, payments, paymentSettings ]
    const pageUrl = props.location
    const splitPageUrl = pageUrl.split('/')
    superAdminPage.forEach(key => {
        if (key.props.id === splitPageUrl[1]) {
            headerPage = key
        }
    })
    const trainedStatusPages = [ 'settings', 'dashboard', 'history', 'summary', 'intents', 'configure' ]
    return (
        <div className="top_nav">
            <div className="nav_menu">
                <nav>
                    <div className="nav toggle"style={{ paddingTop: '6px', marginTop: '18px' }}>
                        <a id="menu_toggle" onClick={props.toggleSidebar} style={{ padding: '9px 2px 1px', marginLeft: '10px' }}>
                            <i className="fa fa-bars" style={{ marginTop: '-10px', marginLeft: '0' }}></i>
                        </a>
                    </div>
                    {headerPage}
                    <ul className="nav navbar-nav navbar-right">
                        <li className="">
                            <Link to={'/'} className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <img src={props.photo} alt="" />{props.userData.name}<span className=" fa fa-angle-down"></span>
                            </Link>
                            <ul className="dropdown-menu dropdown-usermenu pull-right">
                                <li><Link id="profile" to={'/profile'}> Profile</Link></li>
                                {
                                    props.user.role !== 'SUPERADMIN' ? <li><Link id="account" to={'/account'}> Account</Link></li>
                                        : ''
                                }
                                {
                                /*
                                <li>
                                    <Link to={'/'}>
                                        <span className="badge bg-red pull-right">50%</span>
                                        <span>Settings</span>
                                    </Link>
                                </li>
                                <li><Link to={'/'}>Help</Link></li>
                                */
                                }
                                <li><a href="/logout"><i className="fa fa-sign-out pull-right"></i> Log Out</a></li>
                            </ul>
                        </li>
                    </ul>
                    {
                        (!_.get(props, 'isTrained.status', true) && _.includes(trainedStatusPages, props.location.split('/')[1]) && props.botType !== 'CUSTOM')
                            ? <p className="sync-status">
                                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i> There are some untrained data
                            </p> : ''
                    }
                </nav>
            </div>
            <div className="clearfix"></div>
        </div>
    )
}

Header.contextTypes = {
    router: PropTypes.object,
}

Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    photo: PropTypes.string.isRequired,
    botId: PropTypes.string,
    location: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    botName: PropTypes.object.isRequired,
    clientName: PropTypes.string.isRequired,
    userData: PropTypes.object.isRequired,
    isTrained: PropTypes.object.isRequired,
    botType: PropTypes.string.isRequired,
}

export default Header
