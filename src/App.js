import React from "react";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import { AuthLayout, PrivateLayout } from "layouts";
import { AppTheme } from "containers";
import { store } from "reducers";
import { ConfigProvider } from "antd";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { default as MomentUtils } from "@date-io/moment";
import { profileAction } from "actions/profile";
import { browserHistory } from "utils/history";

const App = () => {
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

  return (
    <Provider store={store}>
      <ConfigProvider componentSize="large">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <AppTheme>
            <Router history={browserHistory}>
              {isReady && (
                <Switch>
                  <Route path="/auth" component={AuthLayout} />
                  <Route path="/" component={PrivateLayout} />
                </Switch>
              )}
            </Router>
          </AppTheme>
        </MuiPickersUtilsProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
