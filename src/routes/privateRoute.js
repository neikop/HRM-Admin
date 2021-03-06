import { Home } from "views/Home";
import { Profile } from "views/Profile";
import { JobList } from "views/Job/List";
import { JobCreate } from "views/Job/Create";
import { JobUpdate } from "views/Job/Update";
import { JobView } from "views/Job/View";
import { CompanyList } from "views/Company/List";
import { CompanyCreate } from "views/Company/Create";
import { CompanyDetail } from "views/Company/Detail";
import { CompanyUpdate } from "views/Company/Update";
import { CandidateList } from "views/Candidate/List";
import { CandidateCreate } from "views/Candidate/Create";
import { CandidateUpdate } from "views/Candidate/Update";
import { ReferList } from "views/Refer/List";
import { UserList } from "views/User/List";
import { UserUpdate } from "views/User/Update";
import { NotificationList } from "views/Notification/List";

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
    path: "/jobs",
    component: JobList,
  },
  jobCreate: {
    path: "/jobs/create",
    component: JobCreate,
  },
  jobUpdate: {
    path: "/jobs/:id/edit",
    url: (id) => `/jobs/${id}/edit`,
    component: JobUpdate,
  },
  jobView: {
    path: "/jobs/:id/:active",
    url: (id, active = "detail") => `/jobs/${id}/${active}`,
    component: JobView,
  },

  companyList: {
    path: "/companys",
    component: CompanyList,
  },
  companyCreate: {
    path: "/companys/create",
    component: CompanyCreate,
  },
  companyDetail: {
    path: "/companys/:id/detail",
    url: (id) => `/companys/${id}/detail`,
    component: CompanyDetail,
  },
  companyUpdate: {
    path: "/companys/:id/update",
    url: (id) => `/companys/${id}/update`,
    component: CompanyUpdate,
  },

  candidateList: {
    path: "/candidates",
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

  referList: {
    path: "/referals",
    component: ReferList,
  },

  userList: {
    path: "/users",
    component: UserList,
  },
  userUpdate: {
    path: "/users/:id/update",
    url: (id) => `/users/${id}/update`,
    component: UserUpdate,
  },

  notificationList: {
    path: "/notifications",
    component: NotificationList,
  },
};

export default privateRoute;
