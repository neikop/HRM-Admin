import { Home } from "views/Home";

const privateRoute = {
  home: {
    path: "/",
    name: "Home",
    icon: "",
    component: Home,
  },
  job: {
    path: "/jobs",
    name: "Job",
    icon: "",
    component: Home,
  },
  jobFollow: {
    path: "/jobs-follow",
    name: "Jobs Follow",
    icon: "",
    component: Home,
  },
  cv: {
    path: "/cv",
    name: "CV",
    icon: "",
    component: Home,
  },
  user: {
    path: "/users",
    name: "User",
    icon: "",
    component: Home,
  },
};

export default privateRoute;
