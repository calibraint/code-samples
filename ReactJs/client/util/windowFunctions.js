
/**
 * Window functions for better SSR
 */

const windowMock =  {
    location: {
        origin: '',
        assign: () => {},
    },
}

const getWindow = () => {
    try {
        return window
    } catch (ex) {
        return windowMock
    }
}

export const downloadFile = (url) => {
    getWindow().location.assign(url)
}

export const getLocationOrigin = () => getWindow().location.origin