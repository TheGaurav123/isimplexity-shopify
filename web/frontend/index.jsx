import ReactDOM from "react-dom";
import App from "./App";
import { initI18n } from "./utils/i18nUtils";
import { Auth0Provider } from '@auth0/auth0-react'

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.render(
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
    , document.getElementById("app"))
});
