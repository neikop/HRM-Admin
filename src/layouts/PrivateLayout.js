import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { AppHeader } from "containers";
import { browserHistory } from "utils/history";
import { authRoute, privateRoute } from "routes";

const PrivateLayout = () => {
  const { token } = useSelector(({ profile }) => profile);

  React.useEffect(() => {
    if (token) {
    } else {
      browserHistory.replace(authRoute.login.path);
    }
  }, [token]);

  return (
    <div className="App Private-Layout">
      <AppHeader />
      <div className="App-Body">
        <Switch>
          {Object.values(privateRoute).map(({ path, component }) => (
            <Route exact key={path} path={path} component={component} />
          ))}
          <Redirect from="/" to={privateRoute.home.path} />
        </Switch>
      </div>
    </div>
  );
};

export default PrivateLayout;
