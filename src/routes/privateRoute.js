import { Home } from "views/Home";
import { JobList } from "views/Job/List";
import { JobCreate } from "views/Job/Create";
import { JobUpdate } from "views/Job/Update";
import { JobView } from "views/Job/View";
import { CandidateList } from "views/Candidate/List";
import { CandidateCreate } from "views/Candidate/Create";
import { CandidateUpdate } from "views/Candidate/Update";

const privateRoute = {
  home: {
    path: "/home",
    component: Home,
  },
  jobList: {
    path: "/jobs/list",
    component: JobList,
  },
  jobCreate: {
    path: "/jobs/create",
    component: JobCreate,
  },
  jobView: {
    path: "/jobs/:id/detail",
    url: (id) => `/jobs/${id}/detail`,
    component: JobView,
  },
  jobUpdate: {
    path: "/jobs/:id/edit",
    url: (id) => `/jobs/${id}/edit`,
    component: JobUpdate,
  },

  candidateList: {
    path: "/candidates/list",
    component: CandidateList,
  },
  candidateCreate: {
    path: "/candidates/create",
    component: CandidateCreate,
  },
  candidateUpdate: {
    path: "/candidates/:id/update",
    url: (id) => `/candidates/${id}/update`,
    component: CandidateUpdate,
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
