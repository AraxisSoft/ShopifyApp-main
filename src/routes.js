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
    layout: "/free",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: Person,
    layout: "/free",
  },
  {
    path: "/abandoncart",
    name: "Abandon Cart",
    icon: "content_paste",
    layout: "/free",
  },
  {
    path: "/settings",
    name: "Settings",
    icon: SettingsIcon,
    layout: "/free",
  },
  {
    path: "/upgradetopro",
    name: "Upgrade To Pro",
    icon: "content_paste",
    layout: "/free",
  },
];

export default dashboardRoutes;
