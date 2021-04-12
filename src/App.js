import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { AuthLayout, PrivateLayout } from "layouts";
import { AppTheme } from "containers";
import { browserHistory } from "utils/history";
import "App.scss";

const App = () => {
  return (
    <AppTheme>
      <Router history={browserHistory}>
        <Switch>
          <Route path="/login" component={AuthLayout} />
          <Route path="/" component={PrivateLayout} />
        </Switch>
      </Router>
    </AppTheme>
  );
};

export default App;
