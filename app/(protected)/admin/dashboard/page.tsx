"use client"
import React, { useEffect, useState } from 'react'
import { getClients, getModules, getSubModules, getUserModules, MockClient, MockModule, MockSubModule, MockUserModule } from '@/service/operations/adminMock'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Users, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Settings,
  ArrowRight,
  TrendingUp
} from 'lucide-react'

const AdminDashboard = () => {
  const [clients, setClients] = useState<MockClient[]>([])
  const [modules, setModules] = useState<MockModule[]>([])
  const [subModules, setSubModules] = useState<MockSubModule[]>([])
  const [userModules, setUserModules] = useState<MockUserModule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cls, mods, subs, uMods] = await Promise.all([
          getClients().catch(() => []),
          getModules().catch(() => []),
          getSubModules().catch(() => []),
          getUserModules().catch(() => [])
        ])
        setClients(cls)
        setModules(mods)
        setSubModules(subs)
        setUserModules(uMods)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const stats = [
    {
      title: "Total Clients",
      value: isLoading ? "..." : clients.length,
      description: "Provisioned user accounts",
      icon: Users,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "System Modules",
      value: isLoading ? "..." : modules.length,
      description: "Core modules registered",
      icon: Settings,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Sub-Modules",
      value: isLoading ? "..." : subModules.length,
      description: "Active system submodules",
      icon: Layers,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Role Allocations",
      value: isLoading ? "..." : userModules.length,
      description: "Allocated access matrices",
      icon: ShieldCheck,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    }
  ]

  // Mock activity logs for the dashboard
  const recentActivities = [
    {
      id: 1,
      user: "Admin",
      action: "Assigned Read/Write access for Jane Smith to billing:invoices",
      time: "2 hours ago",
      type: "role"
    },
    {
      id: 2,
      user: "Admin",
      action: "Created new sub-module 'subscriptions' under module 'billing'",
      time: "4 hours ago",
      type: "module"
    },
    {
      id: 3,
      user: "System",
      action: "Registered new client John Doe in database",
      time: "1 day ago",
      type: "client"
    },
    {
      id: 4,
      user: "Admin",
      action: "Created module 'attendance'",
      time: "3 days ago",
      type: "module"
    }
  ]

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Admin Control Panel</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-wider">
              V1.0.0
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Overall overview of modules, users, and authorization configurations.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/45 rounded-lg px-3 py-1.5 font-medium">
          <Activity className="size-4 text-emerald-500 animate-pulse" />
          <span>System status: Online</span>
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border border-border/40 bg-card/30 backdrop-blur-md overflow-hidden relative group hover:border-border/70 transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {stat.title}
                  </span>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-normal block">
                    {stat.description}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation / Quick Actions (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-border/40 rounded-2xl bg-card/45 p-6 shadow-sm backdrop-blur-md">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="size-4.5 text-primary" />
              <span>Quick Navigation Actions</span>
            </h2>
            <div className="flex flex-col gap-3">
              <Link href="/admin/client-list">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border/40 hover:bg-muted/10 text-xs font-semibold text-foreground transition-all group">
                  <div className="flex items-center gap-2.5">
                    <Users className="size-4 text-blue-500" />
                    <span>Manage Client Directory</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/admin/module-management">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border/40 hover:bg-muted/10 text-xs font-semibold text-foreground transition-all group">
                  <div className="flex items-center gap-2.5">
                    <Layers className="size-4 text-purple-500" />
                    <span>Module & Hierarchy</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/admin/role-management">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border/40 hover:bg-muted/10 text-xs font-semibold text-foreground transition-all group">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-amber-500" />
                    <span>Role Permission Matrix</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Audit Trails / Recent Activity Logs (Right) */}
        <div className="lg:col-span-8">
          <div className="border border-border/40 rounded-2xl bg-card/25 p-6 shadow-sm backdrop-blur-md h-full min-h-[300px]">
            <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
              <Activity className="size-4.5 text-primary" />
              <span>Admin Activity Audit Trails</span>
            </h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border/40" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`size-8 rounded-full flex items-center justify-center ring-4 ring-background border text-xs font-bold ${
                            activity.type === 'role' ? 'bg-amber-500/15 border-amber-500/20 text-amber-600 dark:text-amber-400' :
                            activity.type === 'module' ? 'bg-purple-500/15 border-purple-500/20 text-purple-600 dark:text-purple-400' :
                            'bg-blue-500/15 border-blue-500/20 text-blue-600 dark:text-blue-400'
                          }`}>
                            {activity.user.substring(0, 1)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-xs text-foreground/95 font-medium">
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right text-[10px] whitespace-nowrap text-muted-foreground font-medium">
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard