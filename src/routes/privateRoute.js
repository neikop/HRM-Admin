import { Home } from "views/Home";
import { JobList } from "views/Job/List";

const privateRoute = {
  home: {
    path: "/",
    component: Home,
  },
  job: {
    path: "/jobs",
    component: JobList,
  },
  jobFollow: {
    path: "/jobs-follow",
    component: Home,
  },
  cv: {
    path: "/cv",
    component: Home,
  },
  user: {
    path: "/users",
    component: Home,
  },
};

export default privateRoute;
