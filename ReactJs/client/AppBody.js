import React from 'react'

// Import Routes
import ChatbotRoutes from './routes'
import notFoundRoutes from './notFoundRoutes'
import { Route } from 'react-router-dom'


export const AppBody = () => (
    <div>
        <Route path="/" component={ChatbotRoutes} />
        {notFoundRoutes}
    </div>
)

export default AppBody

