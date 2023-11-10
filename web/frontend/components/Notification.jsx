import React from 'react'
import { Toast } from '@shopify/polaris'

const Notification = ({ duration = 1000, message = '', isError = false }) => {
    return (
        <Toast
            duration={duration}
            content={message}
            error={isError}
        />
    )
}

export default Notification