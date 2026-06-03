"use client"

import React, { useState, useMemo, useEffect } from "react"
import { 
  Bell, 
  Flame, 
  ShieldAlert, 
  UserCheck, 
  Sparkles, 
  Camera, 
  Clock, 
  Search, 
  Check, 
  X, 
  Eye, 
  AlertTriangle, 
  SlidersHorizontal,
  RefreshCw,
  Info,
  Calendar,
  Database
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import Image from "next/image"
import { useAppSelector } from "@/hooks/reduxHook"
import { getNotifications } from "@/service/operations/notifications"
import Link from "next/link"

// Type Definitions
interface NotificationData {
  crop: string
  name?: string
  camera_id: string
  timestamp: string
}

interface NotificationItem {
  id: string
  service_name: "restricted" | "attendance" | "customer" | "fire" | string
  data: NotificationData
  userId: string
  status: "PENDING" | "APPROVED" | "DISMISSED"
}

// Initial sample data from backend with generated client-side IDs
const initialNotifications: NotificationItem[] = [
  {
    id: "alert-1",
    service_name: "restricted",
    data: {
      crop: "https://bhushansingh.s3.ap-southeast-2.amazonaws.com/restricted/06fd65699d54a0684d57478667f2794d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5F3JECV37FOVWINM%2F20260530%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041658Z&X-Amz-Expires=900&X-Amz-Signature=cb11ebb0458a88af8538f556370499c1fbf86c1f9347dae6aef2400f7c11c773&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      name: "prince",
      camera_id: "1",
      timestamp: "2026-05-27T20:18:32.514Z"
    },
    userId: "6a0db91257f318bb34626545",
    status: "PENDING"
  },
  {
    id: "alert-2",
    service_name: "attendance",
    data: {
      crop: "https://bhushansingh.s3.ap-southeast-2.amazonaws.com/attendance/0e7063aa8b2250f9d38911c922590916.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5F3JECV37FOVWINM%2F20260529%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T190942Z&X-Amz-Expires=900&X-Amz-Signature=127476f36b62e14c38fc99d1ece166859158e0818e414b694fb8a2bfb3263802&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      name: "unknow",
      camera_id: "1",
      timestamp: "2026-05-29T12:04:14.475Z"
    },
    userId: "6a0db91257f318bb34626545",
    status: "PENDING"
  },
  {
    id: "alert-3",
    service_name: "customer",
    data: {
      crop: "https://bhushansingh.s3.ap-southeast-2.amazonaws.com/customer/222dfaa09fe2e4d0f602a95ed38ac604.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5F3JECV37FOVWINM%2F20260529%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T190942Z&X-Amz-Expires=900&X-Amz-Signature=3706702a8e5aa15c250aa40e78309852bef05c0e0246778890c1b16f1e27366a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      camera_id: "1",
      timestamp: "2026-05-29T12:05:58.181Z"
    },
    userId: "6a0db91257f318bb34626545",
    status: "PENDING"
  },
  {
    id: "alert-4",
    service_name: "fire",
    data: {
      crop: "https://bhushansingh.s3.ap-southeast-2.amazonaws.com/fire/60280240f8a7a5e5ef8e74d70b3e56ce.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5F3JECV37FOVWINM%2F20260529%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T190942Z&X-Amz-Expires=900&X-Amz-Signature=12404e19b6ee9edb86d751873f9c8387be0dfe12180463fe6daf9b3979abc6fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      camera_id: "1",
      timestamp: "2026-05-29T12:06:24.867Z"
    },
    userId: "6a0db91257f318bb34626545",
    status: "PENDING"
  }
]

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [selectedService, setSelectedService] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedAlert, setSelectedAlert] = useState<NotificationItem | null>(null)
  
  // Track mock API state
  const [loadingStates, setLoadingStates] = useState<Record<string, "approving" | "dismissing" | null>>({})

  // Format Helper functions
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    } catch {
      return isoString
    }
  }

  const getRelativeTime = (isoString: string) => {
    try {
      const ms = new Date().getTime() - new Date(isoString).getTime()
      const secs = Math.floor(ms / 1000)
      const mins = Math.floor(secs / 60)
      const hours = Math.floor(mins / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      if (mins > 0) return `${mins}m ago`
      return "just now"
    } catch {
      return ""
    }
  }

  // Update notification status handler
  const handleUpdateStatus = (id: string, newStatus: "APPROVED" | "DISMISSED") => {
    const actionKey = newStatus === "APPROVED" ? "approving" : "dismissing"
    setLoadingStates(prev => ({ ...prev, [id]: actionKey }))

    // Simulate API delay
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
      )
      setLoadingStates(prev => ({ ...prev, [id]: null }))
      
      // Update details modal if active
      if (selectedAlert?.id === id) {
        setSelectedAlert(prev => prev ? { ...prev, status: newStatus } : null)
      }

      if (newStatus === "APPROVED") {
        toast.success("Alert successfully acknowledged and resolved")
      } else {
        toast.info("Alert dismissed")
      }
    }, 600)
  }

  const handleResetAll = () => {
    setNotifications(initialNotifications)
    toast.success("Reset all notifications back to PENDING")
  }

  // Memoized stats calculation
  const stats = useMemo(() => {
    const total = notifications.length
    const critical = notifications.filter(n => n.service_name === "fire").length
    const pending = notifications.filter(n => n.status === "PENDING").length
    const resolved = notifications.filter(n => n.status === "APPROVED").length

    return { total, critical, pending, resolved }
  }, [notifications])

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      // 1. Service Filter
      if (selectedService !== "all" && item.service_name !== selectedService) return false
      
      // 2. Status Filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) return false
      
      // 3. Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const nameMatch = item.data.name?.toLowerCase().includes(query) ?? false
        const camMatch = item.data.camera_id.toLowerCase().includes(query)
        const serviceMatch = item.service_name.toLowerCase().includes(query)
        if (!nameMatch && !camMatch && !serviceMatch) return false
      }
      
      return true
    })
  }, [notifications, selectedService, selectedStatus, searchQuery])

  // UI styling generators based on service type
  const getServiceConfig = (service: string) => {
    switch (service) {
      case "fire":
        return {
          label: "Fire Hazard",
          icon: <Flame className="size-4 text-red-500 animate-pulse" />,
          badgeBg: "bg-red-500/10 border-red-500/30 text-red-400",
          cardBorder: "hover:border-red-500/40 border-l-red-500/80 border-l-[3px]",
          indicator: "bg-red-500"
        }
      case "restricted":
        return {
          label: "Restricted Access",
          icon: <ShieldAlert className="size-4 text-amber-500" />,
          badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          cardBorder: "hover:border-amber-500/40 border-l-amber-500/80 border-l-[3px]",
          indicator: "bg-amber-500"
        }
      case "attendance":
        return {
          label: "Attendance Log",
          icon: <UserCheck className="size-4 text-emerald-500" />,
          badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          cardBorder: "hover:border-emerald-500/40 border-l-emerald-500/80 border-l-[3px]",
          indicator: "bg-emerald-500"
        }
      case "customer":
        return {
          label: "Customer Entry",
          icon: <Sparkles className="size-4 text-purple-500" />,
          badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
          cardBorder: "hover:border-purple-500/40 border-l-purple-500/80 border-l-[3px]",
          indicator: "bg-purple-500"
        }
      default:
        return {
          label: service,
          icon: <Bell className="size-4 text-sky-500" />,
          badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
          cardBorder: "hover:border-sky-500/40 border-l-sky-500/80 border-l-[3px]",
          indicator: "bg-sky-500"
        }
    }
  }
 

  useEffect(()=>{
   
    async function fetchNotifications() {
      try {
        const result=await getNotifications()

        setNotifications(result.data)
      } catch (error) {
        console.log(error)
      }
    } 
    if(notifications.length === 0){
        fetchNotifications();
    }
  

  },[])

  return (
    <div className="py-6 px-1 flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      <Toaster position="bottom-right" />
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Bell className="size-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Notification Alert Board</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time analytics and security response interface for camera monitoring.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetAll} className="h-8 gap-1.5">
            <RefreshCw className="size-3.5" />
            Reset State
          </Button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Widget */}
        <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Total Alerts</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Database className="size-5" />
          </div>
        </div>

        {/* Critical Widget */}
        <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center justify-between shadow-xs border-l-red-500/40 border-l-2">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-semibold text-red-500 tracking-wider">Fire Hazards</p>
            <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
          </div>
          <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
            <Flame className="size-5 animate-pulse" />
          </div>
        </div>

        {/* Pending Widget */}
        <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center justify-between shadow-xs border-l-amber-500/40 border-l-2">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider">Pending Action</p>
            <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
          </div>
          <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Clock className="size-5" />
          </div>
        </div>

        {/* Resolved Widget */}
        <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center justify-between shadow-xs border-l-emerald-500/40 border-l-2">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-semibold text-emerald-500 tracking-wider">Acknowledged</p>
            <p className="text-2xl font-bold text-emerald-500">{stats.resolved}</p>
          </div>
          <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Check className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search camera, person name, event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 hover:bg-muted/70 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-hidden transition-all placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-4 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="size-2.5" />
              </button>
            )}
          </div>

          {/* Action / Sliders Indicator */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">Quick Filters</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/20 pt-3">
          
          {/* Service Filters */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground/80 self-center mr-1.5">Module:</span>
            {[
              { id: "all", label: "All Services" },
              { id: "restricted", label: "Restricted" },
              { id: "attendance", label: "Attendance" },
              { id: "customer", label: "Customer" },
              { id: "fire", label: "Fire Alert" },
            ].map((srv) => (
              <button
                key={srv.id}
                onClick={() => setSelectedService(srv.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all ${
                  selectedService === srv.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 hover:bg-muted border-border/60 text-muted-foreground"
                }`}
              >
                {srv.label}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground/80 self-center mr-1.5">Status:</span>
            {[
              { id: "all", label: "All Status" },
              { id: "PENDING", label: "Pending" },
              { id: "APPROVED", label: "Approved" },
              { id: "DISMISSED", label: "Dismissed" },
            ].map((stat) => (
              <button
                key={stat.id}
                onClick={() => setSelectedStatus(stat.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all ${
                  selectedStatus === stat.id
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-muted/30 hover:bg-muted border-border/60 text-muted-foreground"
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {filteredNotifications.length === 0 ? (
        <div className="border border-dashed border-border/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-card shadow-2xs">
          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
            <AlertTriangle className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-sm">No notifications found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Try adjusting your search query, service selector, or status filter options.
          </p>
          <Button 
            onClick={() => {
              setSelectedService("all")
              setSelectedStatus("all")
              setSearchQuery("")
            }} 
            variant="outline" 
            size="sm" 
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotifications.map((alert,index) => {
            const config = getServiceConfig(alert.service_name)
            const isPending = alert.status === "PENDING"
            
            return (
              <Card 
                key={index} 
                className={`overflow-hidden transition-all duration-200 group bg-card border border-border/70 shadow-xs flex flex-col justify-between ${config.cardBorder}`}
              >
                <div>
                  {/* Image Header wrapper */}
                  <div className="relative aspect-square w-full bg-muted overflow-hidden">
                    <img 
                      src={alert.data.crop} 
                      alt={`${alert.service_name} capture`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback image in case S3 links expire
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400&auto=format&fit=crop"
                      }}
                    />
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 opacity-80" />

                    {/* Top status indicator & module badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-semibold tracking-wide uppercase ${config.badgeBg} backdrop-blur-md`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        alert.status === "PENDING" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        alert.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        "bg-muted/40 text-muted-foreground border border-border/20"
                      } backdrop-blur-md`}>
                        {alert.status}
                      </span>
                    </div>

                    {/* Bottom Metadata inside overlay */}
                    <div className="absolute bottom-2 left-2 right-2 text-white flex justify-between items-end">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Camera className="size-3 opacity-80" />
                        <span className="font-semibold drop-shadow-sm">Cam {alert.data.camera_id}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/90">
                        <Clock className="size-3 opacity-80" />
                        <span className="drop-shadow-sm">{getRelativeTime(alert.data.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                        {config.icon}
                        <span className="capitalize">
                          {alert.data.name === "unknow" ? "Unknown Person" : (alert.data.name || `${config.label} Event`)}
                        </span>
                      </CardTitle>
                      
                      <button 
                        onClick={() => setSelectedAlert(alert)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted"
                        title="View Detailed Metadata"
                      >
                        <Eye className="size-3.5" />
                      </button>
                    </div>
                    
                    <CardDescription className="text-[10px] mt-0.5 truncate text-muted-foreground">
                      User: {alert.userId}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-3 py-1 text-[10px] text-muted-foreground space-y-1">
                    <p className="flex justify-between border-b border-border/20 py-0.5">
                      <span>Occurred:</span>
                      <span className="font-medium text-foreground">{formatDate(alert.data.timestamp)}</span>
                    </p>
                  </CardContent>
                </div>

                {/* Footer with action buttons */}
                <CardFooter className="p-3 pt-2 gap-1.5 border-t border-border/20 mt-2 bg-muted/10">
                  {isPending ? (
                    <>
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(alert.id, "DISMISSED")}
                        disabled={!!loadingStates[alert.id]}
                        className="flex-1"
                      >
                        {loadingStates[alert.id] === "dismissing" ? (
                          <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <X className="size-3 mr-0.5" />
                            Dismiss
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="xs"
                        disabled={!!loadingStates[alert.id]}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                      >
                        {loadingStates[alert.id] === "approving" ? (
                          <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Link className=" flex items-center gap-2" href={`/client/settings/notification/${alert.id}`}>
                            <Check className="size-3 mr-0.5" />
                            Resolve
                          </Link>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="w-full text-center py-1">
                      <span className={`text-[10px] font-semibold ${
                        alert.status === "APPROVED" ? "text-emerald-500" : "text-muted-foreground"
                      }`}>
                        {alert.status === "APPROVED" ? "✓ Resolved & Acknowledged" : "⚠ Dismissed"}
                      </span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedAlert(null)}
              className="absolute right-3 top-3 z-10 size-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105"
            >
              <X className="size-4" />
            </button>

            {/* Left/Top: Image Panel */}
            <div className="md:w-1/2 relative bg-black/40 flex items-center justify-center border-r border-border/30 min-h-[250px] md:min-h-0">
              <img
                src={selectedAlert.data.crop}
                alt="Alert Detail crop"
                className="w-full h-full object-contain max-h-[40vh] md:max-h-[70vh]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop"
                }}
              />
              
              <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded text-white text-[10px] flex items-center gap-1.5">
                <Camera className="size-3.5" />
                <span>Camera Source: {selectedAlert.data.camera_id}</span>
              </div>
            </div>

            {/* Right/Bottom: Metadata Panel */}
            <div className="md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[90vh] bg-card">
              <div className="space-y-4">
                
                {/* Modal Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-semibold uppercase ${getServiceConfig(selectedAlert.service_name).badgeBg}`}>
                      {selectedAlert.service_name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      selectedAlert.status === "PENDING" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      selectedAlert.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                      "bg-muted/40 text-muted-foreground border border-border/20"
                    }`}>
                      {selectedAlert.status}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    {getServiceConfig(selectedAlert.service_name).icon}
                    <span>
                      {selectedAlert.data.name === "unknow" ? "Unknown Detection" : (selectedAlert.data.name || `${selectedAlert.service_name} Event`)}
                    </span>
                  </h3>
                </div>

                <hr className="border-border/40" />

                {/* Key Metrics details */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</p>
                      <p className="text-foreground">{formatDate(selectedAlert.data.timestamp)}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{selectedAlert.data.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Duration Elapsed</p>
                      <p className="text-foreground">{getRelativeTime(selectedAlert.data.timestamp)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">User ID Reference</p>
                      <p className="text-foreground font-mono bg-muted/60 px-1 rounded inline-block text-[10px]">{selectedAlert.userId}</p>
                    </div>
                  </div>
                </div>

                <hr className="border-border/40" />

                {/* S3 Image Location */}
                <div className="bg-muted/40 border border-border/60 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                    <Database className="size-3" />
                    <span>Raw S3 Destination URL</span>
                  </div>
                  <p className="text-[10px] break-all font-mono text-muted-foreground max-h-16 overflow-y-auto leading-relaxed border border-border/20 p-1 rounded bg-muted/20">
                    <Image alt="Image" width={150} height={100} src={selectedAlert.data.crop}/>
                  </p>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-6 border-t border-border/40 mt-5">
                {selectedAlert.status === "PENDING" ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleUpdateStatus(selectedAlert.id, "DISMISSED")}
                      disabled={!!loadingStates[selectedAlert.id]}
                    >
                      {loadingStates[selectedAlert.id] === "dismissing" ? (
                        <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Dismiss Alert"
                      )}
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      onClick={() => handleUpdateStatus(selectedAlert.id, "APPROVED")}
                      disabled={!!loadingStates[selectedAlert.id]}
                    >
                      {loadingStates[selectedAlert.id] === "approving" ? (
                        <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Acknowledge & Resolve"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-2.5 rounded-lg text-center border border-border/40">
                    <span className="text-xs font-semibold flex items-center justify-center gap-1 text-emerald-500">
                      <Check className="size-4" />
                      Resolved by Admin (Status: {selectedAlert.status})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}