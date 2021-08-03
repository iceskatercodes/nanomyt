let appMsgs = {
    ERR_MSG: {
        RETRY: 'Please try again',
        SVC_ERR: 'Internal Error',
        USER_REGISTERED:'User Registered',
        EMAIL:'Please enter valid email',
        NOT_SAME:'Password are not same',
        EMPTY:'Passwords cannot be empty',
        NOT_REGISTERED:'User not registered',
        REGISTERED:'User registerd Already',
        ACCEPT:'Please confirm the link on email'
    },
    ERR_CODE: {
        RETRY: 'RETRY',
        SVC_ERR: 'SVC_ERR',
        USER_REGISTERED:'USER_REGISTERED',
        EMAIL:'EMAIL',
        NOT_SAME:'NOT_SAME',
        EMPTY:'EMPTY',
        NOT_REGISTERED:'NOT_REGISTERED',
        REGISTERED:'REGISTERED',
        ACCEPT:'ACCEPT'
    },
    errorReply: (error_code) => {
        let msg = appMsgs.ERR_MSG[error_code]
        return {
            error: true, code: error_code, msg: msg
        }
    },
    successReply: (msg) => {
        return {
            error: false,
            msg: msg
        }
    }
}

module.exports = appMsgs
