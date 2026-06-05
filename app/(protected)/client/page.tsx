"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {sidebarData } from '@/data';
import { useAppSelector } from '@/hooks/reduxHook';
import { Lock, Unlock, ShieldAlert, Compass, Play, Sparkles, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

const ClientDashboard = () => {
  const user = useAppSelector((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Extract all submodules (services) and calculate how many are unlocked
  const allServices: Array<{
    moduleName: string;
    name: string;
    icon: LucideIcon;
    path: string;
    isAllowed: boolean;
  }> = [];

 sidebarData.forEach((mod) => {
    mod.subModules.forEach((sub) => {
      const isAllowed = !!user?.modulesDetails?.some(
        (x) => x.module_name === mod.module && x.subModule_name === sub.name
      );
      allServices.push({
        moduleName: mod.module,
        name: sub.name,
        icon: sub.icon,
        path: sub.path,
        isAllowed,
      });
    });
  });

  const unlockedCount = allServices.filter((s) => s.isAllowed).length;
  const totalCount = allServices.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const handleLockedClick = (serviceName: string) => {
    toast.error(`Service Locked`, {
      description: `You do not have access to "${serviceName}". Please contact your administrator to request permissions.`,
      duration: 4000,
    });
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Gamified Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white border border-indigo-500/20 shadow-2xl shadow-indigo-500/5">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Compass size={160} className="text-white animate-spin-slow" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/20">
              <Sparkles size={12} />
              Developer Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              Welcome back, {user?.name || "Client"}
            </h1>
            <p className="text-indigo-200/70 text-sm max-w-xl">
              Select an unlocked service to begin. Locked modules require administrator authorization.
            </p>
          </div>

          {/* Gamified Progress Status */}
          <div className="bg-slate-950/50 backdrop-blur-md rounded-xl p-5 border border-white/10 w-full md:w-80 space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
              <span className="text-indigo-400">Services Status</span>
              <span className="text-emerald-400">{unlockedCount} / {totalCount} Unlocked</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-[2px]">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              {progressPercentage === 100 ? "🎉 Level Completed! All modules accessible." : `${Math.round(100 - progressPercentage)}% remaining to unlock all features.`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Grouped by Module Category */}
      <div className="space-y-8">
        {sidebarData.map((ele, index) => {
          // Check if this module has any unlocked services
          const moduleServices = ele.subModules.map((sub) => {
            const isAllowed = !!user?.modulesDetails?.some(
              (x) => x.module_name === ele.module && x.subModule_name === sub.name
            );
            return { ...sub, isAllowed };
          });

          return (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-2">
                <h2 className="text-lg font-bold capitalize tracking-tight text-foreground/90">
                  {ele.module} Services
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                  {moduleServices.filter((s) => s.isAllowed).length} / {moduleServices.length} Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {moduleServices.map((subItem, idx) => {
                  const IconComponent = subItem.icon;

                  if (subItem.isAllowed) {
                    return (
                      <Link 
                        href={subItem.path} 
                        key={idx}
                        className="group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.05] p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/50 hover:bg-emerald-500/[0.04]"
                      >
                        {/* Status indicators */}
                        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                          <Unlock size={16} />
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <IconComponent size={24} />
                          </div>
                          <div className="space-y-1 pr-6">
                            <h3 className="font-bold text-sm capitalize text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {subItem.name}
                            </h3>
                            <p className="text-xs text-muted-foreground/80 leading-normal line-clamp-2">
                              Access all operational control boards, logs, and real-time parameters.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span>UNLOCKED & READY</span>
                          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Launch <Play size={10} className="fill-current" />
                          </span>
                        </div>
                      </Link>
                    );
                  } else {
                    return (
                      <div
                        key={idx}
                        onClick={() => handleLockedClick(subItem.name)}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30 p-5 transition-all duration-300 hover:border-destructive/30 hover:bg-destructive/[0.02]"
                      >
                        {/* Locked visual lock overlay / top indicator */}
                        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground group-hover:bg-destructive/10 group-hover:text-destructive transition-all duration-300">
                          <Lock size={16} className="group-hover:animate-bounce" />
                        </div>

                        <div className="flex items-start gap-4 opacity-60 group-hover:opacity-80 transition-opacity">
                          <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                            <IconComponent size={24} />
                          </div>
                          <div className="space-y-1 pr-6">
                            <h3 className="font-bold text-sm capitalize text-muted-foreground">
                              {subItem.name}
                            </h3>
                            <p className="text-xs text-muted-foreground/60 leading-normal line-clamp-2">
                              Authorization required. Click to request permissions from root admin.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/75 group-hover:text-destructive transition-colors">
                          <span className="flex items-center gap-1">
                            <ShieldAlert size={12} /> LOCKED MODULE
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Unlock
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientDashboard;
