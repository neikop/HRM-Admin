import React from "react";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import { AuthLayout, PrivateLayout } from "layouts";
import { AppTheme } from "containers";
import { store } from "reducers";
import { ConfigProvider } from "antd";
import { profileAction } from "actions/profile";
import { browserHistory } from "utils/history";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
