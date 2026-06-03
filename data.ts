import {
  LayoutDashboard,
  FileChartColumn,
  Search,
  House,
  Megaphone,
  Bell
} from "lucide-react";
export const sidebarClientData = [
  {
    module: "attendance",
    subModules: [
      {
        name: "dashboard",
        icon: LayoutDashboard,
        path: "/client/attendance/dashboard",
      },
      {
        name: "attendance logs",
        icon: FileChartColumn,
        path: "/client/attendance/attendance-logs",
      },
      {
        name: "anomaly",
        icon: Search,
        path: "/client/attendance/anomaly",
      },
    ],
  },
  {
    module: "restricted",
    subModules: [
      {
        name: "restricted area",
        icon: House,
        path: "/client/restricted/restricted-area",
      },
      {
        name: "restricted logs",
        icon: FileChartColumn,
        path: "/client/restricted/restricted-logs",
      },
    ],
  },
  {
    module: "customer",
    subModules: [
      {
        name: "dashboard",
        icon: LayoutDashboard,
        path: "/client/customer/dashboard",
      },
      {
        name: "alert",
        icon: Megaphone,
        path: "/client/customer/alert",
      },
    ],
  },
   {
    module: "fire",
    subModules: [
      {
        name: "alert",
        icon: Megaphone,
        path: "/client/fire/alert",
      }
    ],
  },
  {
    module: "settings",
    subModules: [
      {
        name: "notification",
        icon: Bell,
        path: "/client/settings/notification",
      },
    ],
  },
];
