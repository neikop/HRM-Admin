import { LoginForm } from "views/Login";
import { RegisterForm } from "views/Register";

const authRoute = {
  login: {
    path: "/auth/login",
    component: LoginForm,
  },
  register: {
    path: "/auth/signup",
    component: RegisterForm,
  },
};

export default authRoute;
