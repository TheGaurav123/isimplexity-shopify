import LoginPage from './pages/Login'
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from "react";
import { ExitMajor, CustomersMinor } from '@shopify/polaris-icons'
import { Logo } from './assets'
import { Avatar, Frame, TopBar } from '@shopify/polaris'
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";


export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0()
  const [userMenuActive, setUserMenuActive] = useState(false);

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            { content: `Welcome ${user?.name}`, icon: CustomersMinor, url: '/account' },
          ],
        },
        {
          items: [
            {
              content: 'Logout', icon: ExitMajor, onAction: () => {
                localStorage.removeItem('token')
                logout()

              }, accessibilityLabel: 'Logout', target: '/logout'
            },
          ],
        },
      ]
      }
      avatar={<Avatar source={user?.picture} shape='round' />}
      open={userMenuActive}
      onToggle={() => setUserMenuActive(e => !e)}
    />
  );

  const topBarMarkup = (
    <TopBar
      userMenu={userMenuMarkup}
      logoSuffix={'Spenza'}
    />
  );

  const logo = {
    width: 25,
    topBarSource: Logo,
  };

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const accessToken = await getAccessTokenSilently()
        localStorage.setItem('token', accessToken)
      })()
    }
  }, [isAuthenticated])

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: 'Products',
                  destination: "/",
                },
                // {
                //   label: 'Notifications',
                //   destination: "/notifications",
                // },
                // {
                //   label: 'Orders',
                //   destination: "/orders",
                // },
                // {
                //   label: 'Account',
                //   destination: "/account",
                // }
              ]}
            />
            {
              isAuthenticated
                ?
                <Frame
                  logo={logo}
                  topBar={topBarMarkup}
                >
                  <Routes pages={pages} />
                </Frame>
                :
                <LoginPage />
            }
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  )
}
