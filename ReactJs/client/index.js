import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { configureStore } from './store';

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__

const store = configureStore(initialState);
const root = document.getElementById('root');

const isDev = (process.env.NODE_ENV === 'development')

const render = (Component) => {
    if (isDev) {
      return hydrate(
        <AppContainer>
          <Component store={store} />
        </AppContainer>,
        root
      );
    }
    return hydrate(
        <Component store={store} />,
        root
    );
}

if (isDev && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line global-require
    render(NextApp);
  });
}

render(App);