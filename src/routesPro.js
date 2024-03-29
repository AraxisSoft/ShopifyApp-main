/*!

=========================================================
* * NextJS Material Dashboard v1.0.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    layout: "/proplus",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: Person,
    layout: "/proplus",
  },
  {
    path: "/settings",
    name: "Settings",
    icon: SettingsIcon,
    layout: "/proplus",
  },
  {
    path: "/abandoncart",
    name: "Abandon Cart",
    icon: "content_paste",
    layout: "/proplus",
  },
];

export default dashboardRoutes;
