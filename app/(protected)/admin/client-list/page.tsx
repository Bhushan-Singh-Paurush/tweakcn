"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  X 
} from 'lucide-react'

const ClientListPage = () => {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'client' | 'admin'>('client')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      setAllUsers([])
    } catch (error) {
      console.error(error)
      toast.error('Failed to load clients')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = allUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  )

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address'
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Stub for client integration (to be replaced by user backend action)
      toast.info('Integrating new client details...')
      
      // Simulate success
      setTimeout(() => {
        toast.success('Client add requested (Backend integration required)')
        setName('')
        setEmail('')
        setPhone('')
        setRole('client')
        setIsModalOpen(false)
        setIsSubmitting(false)
      }, 800)
    } catch (error) {
      toast.error('Failed to add client')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and provision clients/users and roles</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <UserPlus className="size-4" />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center max-w-md bg-input/10 border border-border/60 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring/30 transition-all">
        <Search className="size-4 text-muted-foreground mr-2" />
        <input 
          type="text" 
          placeholder="Search by name, email, or phone..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground text-foreground"
        />
      </div>

      {/* Clients Grid/Table */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-card/30 backdrop-blur-md shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      <span>Loading clients...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((client, index) => (
                  <tr key={index} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {(client.name || 'U').substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{client.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="size-3.5" />
                          <span>{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="size-3.5" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${
                        client.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400' 
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                      }`}>
                        {client.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3.5" />
                        <span>{client.createdAt}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity">
          <div className="bg-card border border-border/80 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <UserPlus className="size-5 text-primary" />
                <span>Create New Client</span>
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false)
                  setErrors({})
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field>
                <FieldLabel htmlFor="client-name">Full Name</FieldLabel>
                <Input 
                  id="client-name"
                  type="text" 
                  placeholder="e.g. Acme Corp" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 px-3 border-border/85 bg-input/5"
                />
                <FieldError errors={errors.name ? [{ message: errors.name }] : []} />
              </Field>

              <Field>
                <FieldLabel htmlFor="client-email">Email Address</FieldLabel>
                <Input 
                  id="client-email"
                  type="email" 
                  placeholder="e.g. contact@acme.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 px-3 border-border/85 bg-input/5"
                />
                <FieldError errors={errors.email ? [{ message: errors.email }] : []} />
              </Field>

              <Field>
                <FieldLabel htmlFor="client-phone">Phone Number (Optional)</FieldLabel>
                <Input 
                  id="client-phone"
                  type="text" 
                  placeholder="10-digit number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 px-3 border-border/85 bg-input/5"
                />
                <FieldError errors={errors.phone ? [{ message: errors.phone }] : []} />
              </Field>

              <Field>
                <FieldLabel htmlFor="client-role">Role</FieldLabel>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                      role === 'client' 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border/60 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                      role === 'admin' 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border/60 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </Field>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false)
                    setErrors({})
                  }}
                  className="h-9 px-4 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-9 px-4 text-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Client</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientListPage