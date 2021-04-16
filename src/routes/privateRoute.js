import { Home } from "views/Home";
import { JobList } from "views/Job/List";
import { JobView } from "views/Job/View";
import { CandidateList } from "views/Candidate/List";
import { CandidateView } from "views/Candidate/View";

const privateRoute = {
  home: {
    path: "/home",
    component: Home,
  },
  job: {
    path: "/jobs",
    component: JobList,
  },
  jobView: {
    path: "/jobs/detail/:id",
    url: (id) => `/jobs/detail/${id}`,
    component: JobView,
  },

  candidate: {
    path: "/candidates",
    component: CandidateList,
  },
  candidateView: {
    path: "/candidates/detail/:id",
    url: (id) => `/candidates/detail/${id}`,
    component: CandidateView,
  },

  jobFollow: {
    path: "/jobs-follow",
    component: Home,
  },
  user: {
    path: "/users",
    component: Home,
  },
};

export default privateRoute;
