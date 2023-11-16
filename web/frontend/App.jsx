import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  return (
    isAuthenticated ?
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: 'Home',
                    destination: "/",
                  },
                  {
                    label: 'Notifications',
                    destination: "/notifications",
                  },
                  {
                    label: 'Account',
                    destination: "/account",
                  }
                ]}
              />
              <Routes pages={pages} />
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
      :
      loginWithRedirect()
  );
}
