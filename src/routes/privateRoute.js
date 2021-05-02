import { Home } from "views/Home";
import { Profile } from "views/Profile";
import { JobList } from "views/Job/List";
import { JobCreate } from "views/Job/Create";
import { JobUpdate } from "views/Job/Update";
import { JobView } from "views/Job/View";
import { CandidateList } from "views/Candidate/List";
import { CandidateCreate } from "views/Candidate/Create";
import { CandidateUpdate } from "views/Candidate/Update";
import { UserList } from "views/User/List";
import { UserUpdate } from "views/User/Update";

const privateRoute = {
  home: {
    path: "/home",
    component: Home,
  },
  profile: {
    path: "/profile",
    component: Profile,
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

  userList: {
    path: "/users/list",
    component: UserList,
  },
  userUpdate: {
    path: "/users/:id/update",
    url: (id) => `/users/${id}/update`,
    component: UserUpdate,
  },
};

export default privateRoute;
