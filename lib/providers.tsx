"use client";

import SidebarProvider from "@/context/sidebar-context";
import { ThemeProvider } from "@/context/theme-context";
import { persistor, store } from "@/redex/provider";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <ThemeProvider>
    <SidebarProvider> 
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}></PersistGate> 
      {children}
      </Provider>
    </SidebarProvider>
    </ThemeProvider>
    
  );
}