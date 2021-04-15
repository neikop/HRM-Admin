import React from "react";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import { AuthLayout, PrivateLayout } from "layouts";
import { AppTheme } from "containers";
import { store } from "reducers";
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
    </Provider>
  );
};

export default App;
