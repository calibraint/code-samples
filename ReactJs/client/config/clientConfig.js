
const clientConfig = {
    port: process.env.PORT,
    publicURL: process.env.PUBLIC_URL,
    apiHostName: process.env.API_HOSTNAME,
    apiPort: process.env.API_PORT,
    apiSchema: process.env.API_SCHEMA,
    apiPathname: process.env.API_PATHNAME,
    s3Bucket: {
        avatar: 'clever-developer/avatar',
        surveyAnswer: 'clever-developer/surveyAnswer',
        botAvatar: 'clever-developer/botAvatar',
        bubbleTemplate: 'clever-developer/bubbleTemplate',
    },
    awsCredentials: { // TODO These & the implementations that rely on them hould be moved to server...
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
}

export default clientConfig
