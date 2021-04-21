import React from "react";
import { Provider } from "react-redux";
import { useTranslation } from "react-i18next";
import { Router, Switch, Route } from "react-router-dom";
import { AuthLayout, PrivateLayout } from "layouts";
import { AppTheme } from "containers";
import { store } from "reducers";
import { ConfigProvider } from "antd";
import { profileAction } from "actions/profile";
import { coreuiAction } from "actions/coreui";
import { browserHistory } from "utils/history";

import { LANGUAGE_BARS } from "components/LanguageBar";
import { THEME_BARS, handleChangeMode } from "components/Darkmode";

const App = () => {
  const { i18n } = useTranslation();

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const user = localStorage.getItem("hrm.admin.user");
      profileAction.login(JSON.parse(user));
    } catch {
    } finally {
      setIsReady(true);
    }
  }, []);

  React.useEffect(() => {
    const language = LANGUAGE_BARS.find((item) => item.code === localStorage.getItem("language")) || LANGUAGE_BARS[0];
    coreuiAction.updateLanguage(language.code);
    i18n.changeLanguage(language.code);
  }, [i18n]);

  React.useEffect(() => {
    const darkmode = THEME_BARS.find((item) => item.code === localStorage.getItem("darkmode")) || THEME_BARS[0];
    const isLight = darkmode.code === THEME_BARS[0].code;
    handleChangeMode(isLight);
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider componentSize="large">
        <AppTheme>
          <Router history={browserHistory}>
            {isReady && (
              <Switch>
                <Route path="/login" component={AuthLayout} />
                <Route path="/" component={PrivateLayout} />
              </Switch>
            )}
          </Router>
        </AppTheme>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
