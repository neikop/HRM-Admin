import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { authRoute } from "routes";

const AuthLayout = () => {
  return (
    <div className="App Auth-Layout">
      <Switch>
        {Object.values(authRoute)
          .filter((item) => item.component)
          .map(({ path, component }) => (
            <Route exact key={path} path={path} component={component} />
          ))}
        <Redirect from="/" to={authRoute.login.path} />
      </Switch>
    </div>
  );
};

export default AuthLayout;
