// Mock service for Admin features
// Persisted in localStorage so interactions feel real and survive reloads.

import { apiConnector } from "../apiConnector";
import { CREATE_MODULE } from "../apis";

export interface MockClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "admin";
  status: "active" | "inactive";
  createdAt: string;
}

export interface MockModule {
  _id: string;
  name: string;
  createdAt: string;
}

export interface MockModuleResponse{
       success:boolean,
       message:string,
       data:MockModule
}

export interface MockSubModule {
  _id: string;
  name: string;
  moduleId: string;
  createdAt: string;
}

export interface MockUserModule {
  _id: string;
  userId: string;
  subModuleId: string;
  read: boolean;
  write: boolean;
}

// Initial state data
const initialClients: MockClient[] = [
  {
    _id: "u1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    role: "client",
    status: "active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    _id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    role: "client",
    status: "active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    _id: "u3",
    name: "Admin User",
    email: "admin@tweakcn.com",
    phone: "9876543212",
    role: "admin",
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }
];

const initialModules: MockModule[] = [
  { _id: "m1", name: "attendance", createdAt: new Date().toISOString() },
  { _id: "m2", name: "billing", createdAt: new Date().toISOString() },
  { _id: "m3", name: "users", createdAt: new Date().toISOString() }
];

const initialSubModules: MockSubModule[] = [
  { _id: "s1", name: "attendance-logs", moduleId: "m1", createdAt: new Date().toISOString() },
  { _id: "s2", name: "attendance-summary", moduleId: "m1", createdAt: new Date().toISOString() },
  { _id: "s3", name: "invoices", moduleId: "m2", createdAt: new Date().toISOString() },
  { _id: "s4", name: "subscriptions", moduleId: "m2", createdAt: new Date().toISOString() },
  { _id: "s5", name: "client-list", moduleId: "m3", createdAt: new Date().toISOString() }
];

const initialUserModules: MockUserModule[] = [
  { _id: "um1", userId: "u1", subModuleId: "s1", read: true, write: false },
  { _id: "um2", userId: "u1", subModuleId: "s2", read: true, write: false },
  { _id: "um3", userId: "u2", subModuleId: "s1", read: true, write: true },
  { _id: "um4", userId: "u2", subModuleId: "s3", read: true, write: false }
];

// Helper helpers to access localStorage safely in Next.js CSR
const getStorageItem = <T>(key: string, initialData: T): T => {
  if (typeof window === "undefined") return initialData;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return initialData;
  }
};

const setStorageItem = <T>(key: string, data: T): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Simulated latency
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getClients = async (): Promise<MockClient[]> => {
  await delay();
  return getStorageItem<MockClient[]>("mock_clients", initialClients);
};

export const addClient = async (client: Omit<MockClient, "_id" | "createdAt" | "status">): Promise<MockClient> => {
  await delay();
  const clients = getStorageItem<MockClient[]>("mock_clients", initialClients);
  const newClient: MockClient = {
    ...client,
    _id: "u_" + Math.random().toString(36).substr(2, 9),
    status: "active",
    createdAt: new Date().toISOString().split('T')[0]
  };
  clients.push(newClient);
  setStorageItem("mock_clients", clients);
  return newClient;
};

export const getModules = async (): Promise<MockModule[]> => {
  await delay();
  return getStorageItem<MockModule[]>("mock_modules", initialModules);
};

export const createModule = async (name: string): Promise<MockModuleResponse> => {
    try {
        const{data:response}=await apiConnector(CREATE_MODULE,"POST",{name})

        return response;
    } catch (error) {
      throw error
    }
};

export const getSubModules = async (): Promise<MockSubModule[]> => {
  await delay();
  return getStorageItem<MockSubModule[]>("mock_submodules", initialSubModules);
};

export const createSubModule = async (name: string, moduleId: string): Promise<MockSubModule> => {
  await delay();
  const subModules = getStorageItem<MockSubModule[]>("mock_submodules", initialSubModules);
  const normalizedName = name.trim().toLowerCase();

  const newSubModule: MockSubModule = {
    _id: "s_" + Math.random().toString(36).substr(2, 9),
    name: normalizedName,
    moduleId,
    createdAt: new Date().toISOString()
  };
  subModules.push(newSubModule);
  setStorageItem("mock_submodules", subModules);
  return newSubModule;
};

export const getUserModules = async (): Promise<MockUserModule[]> => {
  await delay();
  return getStorageItem<MockUserModule[]>("mock_usermodules", initialUserModules);
};

export const saveUserPermissions = async (userId: string, permissions: Array<{ subModuleId: string; read: boolean; write: boolean }>): Promise<void> => {
  await delay();
  let userModules = getStorageItem<MockUserModule[]>("mock_usermodules", initialUserModules);
  
  // Filter out existing permissions for this user
  userModules = userModules.filter(um => um.userId !== userId);
  
  // Add updated permissions
  permissions.forEach(p => {
    userModules.push({
      _id: "um_" + Math.random().toString(36).substr(2, 9),
      userId,
      subModuleId: p.subModuleId,
      read: p.read,
      write: p.write
    });
  });
  
  setStorageItem("mock_usermodules", userModules);
};
