import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BasicSidebarItem = ({ isActive, linkTo, title, icon }) => (
    <li className={isActive ? 'active' : ''}>
        <Link to={linkTo} >
            <i className={`fa fa-${icon || 'question' }`}></i> {title}
        </Link>
    </li>
)

BasicSidebarItem.propTypes = {
    isActive: PropTypes.bool.isRequired,
    linkTo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
}

const SuperAdminTop = ({ location }) => (
    <>
        <BasicSidebarItem
            title="Super Admin Dashboard"
            icon="desktop"
            linkTo={'/clientDashboard'}
            isActive={location.startsWith('/clientDashboard')} />

        <BasicSidebarItem
            title="Clients"
            icon="user"
            linkTo={'/clients'}
            isActive={location.startsWith('/clients')} />
    </>
)

const SuperAdminBottom = ({ location }) => (
    <>
        <BasicSidebarItem
            title="Payment Settings"
            icon="money"
            linkTo={'/paymentSettings'}
            isActive={location.startsWith('/paymentSettings')} />

        <BasicSidebarItem
            title="Watson Service"
            icon="sellsy"
            linkTo={'/watsonService'}
            isActive={location.startsWith('/watsonService')} />
    </>
)

const ClientSection = ({ location, clientId }) => (
    <>
        <BasicSidebarItem
            title="Chatbots"
            icon="comments"
            linkTo={`/chatbots/${clientId}`}
            isActive={location.startsWith('/chatbots')}
        />
    </>
)

const ClientAdminSection = ({ location, clientId }) => (
    <>
        <BasicSidebarItem
            title="Employees"
            icon="users"
            linkTo={`/employees/${clientId}`}
            isActive={location.startsWith('/employees')}
        />
    </>
)

const ChatbotSection = ({ location, clientId, chatbotId }) => (
    <>
        <BasicSidebarItem
            title="Home"
            icon="home"
            linkTo={`/dashboard/${clientId}/${chatbotId}`}
            isActive={location.startsWith('/dashboard')} />

        <BasicSidebarItem
            title="History"
            icon="history"
            linkTo={`/history/${clientId}/${chatbotId}`}
            isActive={location.startsWith('/history')} />

        <BasicSidebarItem
            title="Summary"
            icon="comments"
            linkTo={`/summary/${clientId}/${chatbotId}`}
            isActive={location.startsWith('/summary')}
        />

        <BasicSidebarItem
            title="Settings"
            icon="wrench"
            linkTo={`/settings/${clientId}/${chatbotId}`}
            isActive={location.startsWith('/settings')}
        />

        <BasicSidebarItem
            title="Flow"
            icon="edit"
            linkTo={`/configure/${clientId}/${chatbotId}`}
            isActive={location.startsWith('/configure')}
        />
    </>
)


const chatbotRoutes = [ '/dashboard', '/history', '/summary', '/settings', '/configure' ] // TODO add survey/faq routes

const SidebarList = ({ location, user, clientId, chatbotId }) => {
    const isSuperAdmin = (user.role === 'SUPERADMIN')
    const isEmployee = (user.role === 'EMPLOYEE')
    const isClientAdmin = !isEmployee

    const isChatbotRoute = chatbotRoutes.find((route) => location.startsWith(route))
    const showClientSection = !!clientId
    const showClientAdminSection = showClientSection && isClientAdmin
    const showChatbotSection = showClientSection && isChatbotRoute

    return (
        <ul className="nav side-menu">
            {
                isSuperAdmin
                    && <SuperAdminTop location={location} />
            }
            {
                showClientSection
                    && <ClientSection location={location} clientId={clientId} chatbotId={chatbotId} />
            }
            {
                showChatbotSection
                    && <ChatbotSection location={location} clientId={clientId} chatbotId={chatbotId} />
            }
            {
                showClientAdminSection
                    && <ClientAdminSection location={location} clientId={clientId} />
            }
            {
                isSuperAdmin
                    && <SuperAdminBottom location={location} />
            }
        </ul>
    )
}

SidebarList.propTypes = {
    location: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    clientId: PropTypes.string.isRequired,
    chatbotId: PropTypes.string.isRequired,
}

export default SidebarList