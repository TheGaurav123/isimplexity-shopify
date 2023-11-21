import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@shopify/polaris'
import { EnterMajor } from '@shopify/polaris-icons'

const Login = () => {
    const { loginWithPopup, isLoading } = useAuth0()
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <h2 style={{
                fontSize: '19px',
                fontWeight: '500',
            }}>Please Login To Continue...</h2>
            <Button
                icon={EnterMajor}
                primary
                onClick={loginWithPopup}
                loading={isLoading}
            >
                Login
            </Button>
        </div>
    )
}

export default Login