import LoginPage from './pages/Login'
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { useAuth0 } from '@auth0/auth0-react'
import { useState } from "react";
import { ExitMajor, CustomersMinor } from '@shopify/polaris-icons'
import { Logo } from './assets'
import { Frame, TopBar } from '@shopify/polaris'
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";


export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { isAuthenticated, user, logout } = useAuth0()
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
            { content: 'Logout', icon: ExitMajor, onAction: logout, accessibilityLabel: 'Logout', target:'/logout' },
          ],
        },
      ]
      }
      avatar={user?.picture}
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
                {
                  label: 'Notifications',
                  destination: "/notifications",
                },
                {
                  label: 'Orders',
                  destination: "/orders",
                },
                {
                  label: 'Account',
                  destination: "/account",
                }
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
