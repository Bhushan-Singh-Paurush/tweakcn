"use client"
import React, { useEffect, useState } from 'react'
import { 
  getClients, 
  getModules, 
  getSubModules, 
  getUserModules, 
  saveUserPermissions, 
  MockClient, 
  MockModule, 
  MockSubModule,
  MockUserModule
} from '@/service/operations/adminMock'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { 
  ShieldAlert, 
  Check, 
  ListTodo,
  ArrowRightCircle
} from "lucide-react"

interface LocalPermission {
  subModuleId: string;
  read: boolean;
  write: boolean;
}

const RoleManagementPage = () => {
  const [clients, setClients] = useState<MockClient[]>([])
  const [modules, setModules] = useState<MockModule[]>([])
  const [subModules, setSubModules] = useState<MockSubModule[]>([])
  const [userModules, setUserModules] = useState<MockUserModule[]>([])
  
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [permissions, setPermissions] = useState<Record<string, LocalPermission>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [cls, mods, subs, uMods] = await Promise.all([
        getClients(),
        getModules(),
        getSubModules(),
        getUserModules()
      ])
      
      setClients(cls)
      setModules(mods)
      setSubModules(subs)
      setUserModules(uMods)
      
      // Auto-select first client if available
      if (cls.length > 0) {
        setSelectedUserId(cls[0]._id)
        initializeUserPermissions(cls[0]._id, subs, uMods)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load roles and permissions")
    } finally {
      setIsLoading(false)
    }
  }

  const initializeUserPermissions = (userId: string, subs: MockSubModule[], uMods: MockUserModule[]) => {
    const initialPerms: Record<string, LocalPermission> = {}
    
    subs.forEach(sub => {
      const existing = uMods.find(um => um.userId === userId && um.subModuleId === sub._id)
      initialPerms[sub._id] = {
        subModuleId: sub._id,
        read: existing ? existing.read : false,
        write: existing ? existing.write : false
      }
    });
    
    setPermissions(initialPerms)
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    initializeUserPermissions(userId, subModules, userModules)
  }

  const handleCheckboxChange = (subModuleId: string, type: 'read' | 'write', checked: boolean) => {
    setPermissions(prev => {
      const current = prev[subModuleId] || { subModuleId, read: false, write: false }
      const updated = { ...current, [type]: checked }
      
      // Auto rule: if 'write' is checked, 'read' must also be checked
      if (type === 'write' && checked) {
        updated.read = true
      }
      // Auto rule: if 'read' is unchecked, 'write' must also be unchecked
      if (type === 'read' && !checked) {
        updated.write = false
      }

      return {
        ...prev,
        [subModuleId]: updated
      }
    })
  }

  const handleSave = async () => {
    if (!selectedUserId) {
      toast.error("No user selected")
      return
    }

    setIsSaving(true)
    try {
      const permsArray = Object.values(permissions)
      await saveUserPermissions(selectedUserId, permsArray)
      
      // Refresh local copy of permissions mapping
      const updatedUMods = await getUserModules()
      setUserModules(updatedUMods)
      
      toast.success("User roles and permissions updated successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to save permissions")
    } finally {
      setIsSaving(false)
    }
  }

  const currentClient = clients.find(c => c._id === selectedUserId)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Role & Permissions Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Assign read and write permissions to clients and modules</p>
        </div>
        
        {/* Save button in header */}
        {!isLoading && selectedUserId && (
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground px-5 h-9 rounded-lg shadow-sm transition-all"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>Save Permissions</span>
              </>
            )}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading permissions matrix...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User selector panel */}
          <div className="lg:col-span-4 border border-border/40 rounded-2xl bg-card/30 p-6 shadow-sm backdrop-blur-md">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
              <ShieldAlert className="size-4 text-primary" />
              <span>Select Client or Administrator</span>
            </h2>
            
            <div className="space-y-4">
              <label htmlFor="user-select" className="text-xs text-muted-foreground font-medium">
                Target User
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => handleUserChange(e.target.value)}
                className="h-10 w-full rounded-md border border-border/85 bg-input/20 dark:bg-input/30 px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 text-foreground"
              >
                {clients.map((c) => (
                  <option key={c._id} value={c._id} className="text-foreground bg-card">
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>

              {currentClient && (
                <div className="mt-6 border-t border-border/20 pt-4 space-y-2">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">User details</div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-semibold text-foreground capitalize">{currentClient.role}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold text-foreground">{currentClient.email}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold uppercase text-[10px]`}>
                      {currentClient.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-8 border border-border/40 rounded-2xl bg-card/20 overflow-hidden shadow-sm backdrop-blur-md">
            <div className="px-6 py-4 bg-muted/20 border-b border-border/40 flex justify-between items-center">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ListTodo className="size-4 text-primary" />
                <span>Access Permissions Control Matrix</span>
              </h2>
              {currentClient && (
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  Editing for <ArrowRightCircle className="size-3.5 text-primary ml-1" /> <strong>{currentClient.name}</strong>
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/10 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Module</th>
                    <th className="px-6 py-3">Sub-Module</th>
                    <th className="px-6 py-3 text-center w-32">Read Access</th>
                    <th className="px-6 py-3 text-center w-32">Write Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-sm">
                  {modules.map((mod) => {
                    const linkedSubs = subModules.filter(sub => sub.moduleId === mod._id)
                    
                    if (linkedSubs.length === 0) {
                      return null;
                    }

                    return linkedSubs.map((sub, idx) => {
                      const subPerm = permissions[sub._id] || { read: false, write: false }
                      return (
                        <tr key={sub._id} className="hover:bg-muted/5 transition-colors">
                          {idx === 0 && (
                            <td 
                              rowSpan={linkedSubs.length} 
                              className="px-6 py-4 font-semibold text-foreground bg-muted/5 capitalize border-r border-border/10 font-medium"
                            >
                              {mod.name}
                            </td>
                          )}
                          <td className="px-6 py-4 capitalize font-medium text-foreground/90">
                            {sub.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={subPerm.read}
                                onCheckedChange={(checked) => 
                                  handleCheckboxChange(sub._id, 'read', !!checked)
                                }
                                aria-label={`Read access for ${sub.name}`}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={subPerm.write}
                                onCheckedChange={(checked) => 
                                  handleCheckboxChange(sub._id, 'write', !!checked)
                                }
                                aria-label={`Write access for ${sub.name}`}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default RoleManagementPage