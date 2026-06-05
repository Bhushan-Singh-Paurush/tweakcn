import {
  LayoutDashboard,
  FileChartColumn,
  Search,
  House,
  Megaphone,
  Bell,
  Camera,
  Users,
  BookUser,
  UserRoundKey,
  Package,
} from "lucide-react";
export const sidebarData = [
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
      {
        name: "customer",
        icon: Users,
        path: "/client/customer",
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
      },
      {
        name: "dashboard",
        icon: LayoutDashboard,
        path: "/client/fire/dashboard",
      },
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
      {
        name: "camera",
        icon: Camera,
        path: "/client/settings/camera",
      },
    ],
  },
  {
    module: "vehicle",
    subModules: [
      {
        name: "dashboard",
        icon: LayoutDashboard,
        path: "/client/vehicle/dashboard",
      },
      {
        name: "vehicle logs",
        icon: FileChartColumn,
        path: "/client/vehicle/vehicle-logs",
      },
    ],
  },
  {
    module: "crowd",
    subModules: [
      {
        name: "dashboard",
        icon: LayoutDashboard,
        path: "/client/crowd/dashboard",
      },
      {
        name: "people counting",
        icon: Users,
        path: "/client/crowd/people-counting",
      },
    ],
  },
  {
    module: "admin",
    subModules: [
      {
        name: "dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      {
        name: "client list",
        icon: BookUser,
        path: "/admin/client-list",
      },
      {
        name: "role management",
        icon: UserRoundKey,
        path: "/admin/role-management",
      },
      {
        name:"module management",
        icon:Package,
        path:"/admin/module-management"
      }
    ],
  },
];
