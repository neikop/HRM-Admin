import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { AppHeader } from "containers";
import { privateRoute } from "routes";

const PrivateLayout = () => {
  return (
    <div className="App Private-Layout">
      <AppHeader />
      <Switch>
        {Object.values(privateRoute)
          .filter((item) => item.component)
          .map(({ path, component }) => (
            <Route exact key={path} path={path} component={component} />
          ))}
        <Redirect from="/" to={privateRoute.home.path} />
      </Switch>
    </div>
  );
};

export default PrivateLayout;
