"use client"
import React, { useEffect, useState } from 'react'
import { getModules, getSubModules, createModule, createSubModule, MockModule, MockSubModule } from '@/service/operations/adminMock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'
import { 
  FolderPlus, 
  Layers, 
  LayoutGrid 
} from 'lucide-react'


const ModuleManagementPage = () => {
  const [modules, setModules] = useState<MockModule[]>([])
  const [subModules, setSubModules] = useState<MockSubModule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Module form state
  const [moduleName, setModuleName] = useState('')
  const [moduleError, setModuleError] = useState('')
  const [isCreatingModule, setIsCreatingModule] = useState(false)

  // Sub-module form state
  const [subModuleName, setSubModuleName] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [subModuleError, setSubModuleError] = useState('')
  const [isCreatingSubModule, setIsCreatingSubModule] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [mods, subs] = await Promise.all([getModules(), getSubModules()])
      setModules(mods)
      setSubModules(subs)
      if (mods.length > 0) {
        setSelectedModuleId(mods[0]._id)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch modules")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setModuleError('')

    if (!moduleName.trim()) {
      setModuleError('Module name is required')
      return
    }

    setIsCreatingModule(true)
    try {
      const newMod = await createModule(moduleName)

      console.log(newMod)

      toast.success(`Module created`)
      setModuleName('')
      await loadData()
    } catch (error) {
      setModuleError('Failed to create module')
      toast.error('Failed to create module')
    } finally {
      setIsCreatingModule(false)
    }
  }

  const handleCreateSubModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubModuleError('')

    if (!subModuleName.trim()) {
      setSubModuleError('Sub-Module name is required')
      return
    }
    if (!selectedModuleId) {
      setSubModuleError('Please select a parent module')
      return
    }

    setIsCreatingSubModule(true)
    try {
      const newSub = await createSubModule(subModuleName, selectedModuleId)
      toast.success(`Sub-Module "${newSub.name}" created`)
      setSubModuleName('')
      await loadData()
    } catch (error) {
      setSubModuleError('Failed to create sub-module')
      toast.error('Failed to create sub-module')
    } finally {
      setIsCreatingSubModule(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Module Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage system modules and sub-modules hierarchy</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading modules...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Forms */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Create Module Card */}
            <div className="border border-border/40 rounded-2xl bg-card/40 p-6 shadow-sm backdrop-blur-md">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <FolderPlus className="size-4 text-primary" />
                <span>Create New Module</span>
              </h2>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="mod-name">Module Name</FieldLabel>
                  <Input
                    id="mod-name"
                    type="text"
                    placeholder="e.g. attendance, payroll, settings"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="h-9 px-3 bg-input/5 border-border/85"
                  />
                  <FieldError errors={moduleError ? [{ message: moduleError }] : []} />
                </Field>
                <Button
                  type="submit"
                  disabled={isCreatingModule}
                  className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs flex items-center justify-center gap-1.5"
                >
                  {isCreatingModule ? 'Creating...' : 'Create Module'}
                </Button>
              </form>
            </div>

            {/* Create Sub-Module Card */}
            <div className="border border-border/40 rounded-2xl bg-card/40 p-6 shadow-sm backdrop-blur-md">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <Layers className="size-4 text-primary" />
                <span>Create Sub-Module</span>
              </h2>
              <form onSubmit={handleCreateSubModule} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="submod-name">Sub-Module Name</FieldLabel>
                  <Input
                    id="submod-name"
                    type="text"
                    placeholder="e.g. logs, summaries, billing-settings"
                    value={subModuleName}
                    onChange={(e) => setSubModuleName(e.target.value)}
                    className="h-9 px-3 bg-input/5 border-border/85"
                  />
                  <FieldError errors={subModuleError ? [{ message: subModuleError }] : []} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="parent-module">Parent Module</FieldLabel>
                  <select
                    id="parent-module"
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="h-9 w-full rounded-md border border-border/85 bg-input/20 dark:bg-input/30 px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 text-foreground"
                  >
                    {modules.map((mod) => (
                      <option key={mod._id} value={mod._id} className="text-foreground bg-card">
                        {mod.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Button
                  type="submit"
                  disabled={isCreatingSubModule}
                  className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs flex items-center justify-center gap-1.5"
                >
                  {isCreatingSubModule ? 'Creating...' : 'Create Sub-Module'}
                </Button>
              </form>
            </div>

          </div>

          {/* Right panel: Module tree view */}
          <div className="lg:col-span-7">
            <div className="border border-border/40 rounded-2xl bg-card/20 p-6 shadow-sm backdrop-blur-md h-full min-h-[400px]">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
                <LayoutGrid className="size-4 text-primary" />
                <span>Modules and Sub-Modules Structure</span>
              </h2>

              {modules.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                  No modules created yet. Use the form to add one.
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((mod) => {
                    const linkedSubs = subModules.filter(sub => sub.moduleId === mod._id)
                    return (
                      <div 
                        key={mod._id} 
                        className="border border-border/30 rounded-xl overflow-hidden bg-card/40 hover:border-border/60 transition-all duration-300 shadow-sm"
                      >
                        {/* Module header */}
                        <div className="flex items-center justify-between bg-muted/30 px-5 py-3.5 border-b border-border/20">
                          <div className="flex items-center gap-2.5">
                            <div className="size-6 bg-primary/10 text-primary rounded-md flex items-center justify-center font-bold text-xs capitalize">
                              {mod.name.substring(0, 1)}
                            </div>
                            <span className="font-bold text-foreground text-sm capitalize">{mod.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono bg-border/45 px-1.5 py-0.5 rounded-sm">
                            {mod._id}
                          </span>
                        </div>

                        {/* Submodules list */}
                        <div className="p-4 bg-transparent">
                          {linkedSubs.length === 0 ? (
                            <span className="text-xs text-muted-foreground/75 italic px-2 block py-1">
                              No sub-modules under this module.
                            </span>
                          ) : (
                            <ul className="space-y-2">
                              {linkedSubs.map((sub) => (
                                <li 
                                  key={sub._id} 
                                  className="flex justify-between items-center bg-input/10 dark:bg-input/20 border border-border/20 hover:border-border/40 px-4 py-2 rounded-lg transition-all"
                                >
                                  <span className="text-xs text-foreground font-medium capitalize">{sub.name}</span>
                                  <span className="text-[10px] text-muted-foreground/75 font-mono">
                                    ID: {sub._id}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModuleManagementPage
