import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from './modules/App/App'
import universal from 'react-universal-component'

const LoadingDisplay = () => (
    <div className="load">
        <div className="content">
            <div className="initial-load-animation">
                <div className="linkedin-image"></div>
                <div id="loadingProgressG">
                    <div id="loadingProgressG_1" className="loadingProgressG"></div>
                </div>
                <br/>
            </div>
        </div>
    </div>
)

const ErrorDisplay = () => (
    <div className="load">
        <div className="content">
            <div className="initial-load-animation">
                <div className="linkedin-image"></div>
                <div id="loadingProgressG">
                    <div id="loadingProgressG_1" className="loadingProgressG"></div>
                </div>
                <br/>

                <div>
                    An error occured.
                    <br/>
                </div>

            </div>
        </div>
    </div>
)

const defaultLoadable = (loader) => universal(loader, {
    loading: LoadingDisplay,
    error: ErrorDisplay,
})

const loadableRoutes = [
    {
        path: '/clients',
        component: defaultLoadable(() => import('./modules/Clients/Clients')),
    },
    {
        path: '/chatbots/:clientId',
        component: defaultLoadable(() => import('./modules/Chatbots/Chatbots')),
    },
    {
        path: '/dashboard/:clientId/:chatbotId',
        component: defaultLoadable(() => import('./modules/Home/Home')),
    },
]


const RouteApp = () => (
    <App>
        <Switch>
            {
                loadableRoutes.map((route) => <Route key={route.path} exact path={route.path} component={route.component} />)
            }
        </Switch>
    </App>
)

export default RouteApp
