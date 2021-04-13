import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { browserHistory } from "utils/history";
import { authRoute, privateRoute } from "routes";

const AuthLayout = () => {
  const { token } = useSelector(({ profile }) => profile);

  React.useEffect(() => {
    if (token) {
      browserHistory.replace(privateRoute.home.path);
    }
  }, [token]);

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
