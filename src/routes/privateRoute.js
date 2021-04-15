import { Home } from "views/Home";
import { JobList } from "views/Job/List";
import { JobView } from "views/Job/View";

const privateRoute = {
  home: {
    path: "/home",
    component: Home,
  },
  job: {
    path: "/jobs",
    component: JobList,
  },
  jobItem: {
    path: "/jobs/detail/:id",
    url: (id) => `/jobs/detail/${id}`,
    component: JobView,
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
