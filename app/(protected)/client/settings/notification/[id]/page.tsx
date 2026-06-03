"use client";
import {
  getNotificationById,
  getSecurityPerson,
  sendNotification,
} from "@/service/operations/notifications";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiConnector } from "@/service/apiConnector";
import { GET_SECURITY_PERSON } from "@/service/apis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowLeft,
  Plus,
  Mail,
  Check,
  X,
  Camera,
  Clock,
  Loader2,
  User,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Sparkles,
  Bell,
  MailOpen,
  Send,
  Square,
  CheckSquare
} from "lucide-react";

interface Data {
  crop: string;
  name: string;
  camera_id: string;
  timestamp: string;
}

interface Notification {
  service_name: string;
  data: Data;
  status: string;
  id: string;
}

interface Person {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: boolean;
}

function ResolveNotificationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loadingNotification, setLoadingNotification] = useState(true);
  const [loadingPersons, setLoadingPersons] = useState(true);

  // Selection state for multiple persons
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);

  // Add Person Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Send Email Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedPersonsForEmail, setSelectedPersonsForEmail] = useState<Person[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [recipientEmails, setRecipientEmails] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Fetch Notification details
  const fetchNotification = async () => {
    try {
      setLoadingNotification(true);
      const result = await getNotificationById(params.id);
      if (result?.success && result?.data) {
        setNotification(result.data);
      } else {
        toast.error("Failed to fetch notification details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading notification details");
    } finally {
      setLoadingNotification(false);
    }
  };

  // Fetch Security Persons list
  const fetchPersons = async () => {
    try {
      setLoadingPersons(true);
      const result = await getSecurityPerson();
      if (result?.success && Array.isArray(result.data)) {
        setPersons(result.data);
        // Clear selections if persons list changes significantly
        setSelectedPersonIds([]);
      } else {
        console.error("Unexpected persons structure:", result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPersons(false);
    }
  };

  useEffect(() => {
    fetchNotification();
    fetchPersons();
  }, [params.id]);

  // Format Helper functions
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getServiceConfig = (service: string) => {
    switch (service?.toLowerCase()) {
      case "fire":
        return {
          label: "Fire Hazard",
          icon: <Flame className="size-5 text-red-500 animate-pulse" />,
          badgeBg: "bg-red-500/10 border-red-500/30 text-red-400",
          cardBorder: "border-l-red-500/80 border-l-[4px]",
        };
      case "restricted":
        return {
          label: "Restricted Access",
          icon: <ShieldAlert className="size-5 text-amber-500" />,
          badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          cardBorder: "border-l-amber-500/80 border-l-[4px]",
        };
      case "attendance":
        return {
          label: "Attendance Log",
          icon: <User className="size-5 text-emerald-500" />,
          badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          cardBorder: "border-l-emerald-500/80 border-l-[4px]",
        };
      case "customer":
        return {
          label: "Customer Entry",
          icon: <Sparkles className="size-5 text-purple-500" />,
          badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
          cardBorder: "border-l-purple-500/80 border-l-[4px]",
        };
      default:
        return {
          label: service || "General Alert",
          icon: <Bell className="size-5 text-sky-500" />,
          badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
          cardBorder: "border-l-sky-500/80 border-l-[4px]",
        };
    }
  };

  const serviceConfig = notification ? getServiceConfig(notification.service_name) : null;

  // Toggle selection for a single person
  const togglePersonSelection = (id: string) => {
    setSelectedPersonIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Select all or Deselect all responders
  const handleSelectAllToggle = () => {
    if (selectedPersonIds.length === persons.length) {
      setSelectedPersonIds([]);
    } else {
      setSelectedPersonIds(persons.map(p => p.id || p.email));
    }
  };

  // Add new security person handler
  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setAddLoading(true);
    try {
      const response = await apiConnector(GET_SECURITY_PERSON, "POST", {
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        status: true,
      });

      if (response?.data?.success) {
        toast.success("Security person added successfully!");
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setIsAddModalOpen(false);
        fetchPersons();
      } else {
        toast.error(response?.data?.message || "Failed to add security person");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the responder.");
    } finally {
      setAddLoading(false);
    }
  };

  // Open email modal for multiple selected responders
  const handleOpenEmailModalForSelected = () => {
    const selected = persons.filter(p => selectedPersonIds.includes(p.id || p.email));
    if (selected.length === 0) {
      toast.error("No responders selected.");
      return;
    }
    setSelectedPersonsForEmail(selected);
    setRecipientEmails(selected.map(p => p.email).join(", "));
    setEmailSubject(`Alert Notification - ${notification ? getServiceConfig(notification.service_name).label : "Security Event"}`);
    setEmailBody("");
    setEmailSentSuccess(false);
    setIsEmailModalOpen(true);
  };

  // Open email modal for a single responder directly
  const handleOpenEmailModalForSingle = (person: Person) => {
    setSelectedPersonsForEmail([person]);
    setRecipientEmails(person.email);
    setEmailSubject(`Alert Notification - ${notification ? getServiceConfig(notification.service_name).label : "Security Event"}`);
    setEmailBody("");
    setEmailSentSuccess(false);
    setIsEmailModalOpen(true);
  };

  // Auto fill email composer with details from notification
  const handleAutoFill = () => {
    if (!notification) return;
    const config = getServiceConfig(notification.service_name);
    
    // Customize greeting depending on multiple recipients
    const recipientNames = selectedPersonsForEmail.map(p => p.name).join(", ");
    const greeting = selectedPersonsForEmail.length > 1 
      ? `Hello Security Team (${recipientNames}),`
      : `Hello ${selectedPersonsForEmail[0]?.name || "Responder"},`;

    const bodyText = `${greeting}

A security notification requires your immediate attention.

[EVENT DETAILS]
- Event Type: ${config.label}
- Camera Source: Camera ID ${notification.data.camera_id}
- Logged At: ${formatDate(notification.data.timestamp)}
- Status: ${notification.status}
- Reference ID: ${notification.id}

[SNAPSHOT ACCESS]
Captured Image URL: ${notification.data.crop}

Please inspect the location and confirm status.

Best Regards,
Security Control Team`;

    setEmailSubject(`[URGENT ALERT] ${config.label} - Cam ${notification.data.camera_id}`);
    setEmailBody(bodyText);
    toast.success("Form pre-filled with alert logs!");
  };

  // Send Email simulated handler
 const handleSendEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !recipientEmails.trim() ||
    !emailSubject.trim() ||
    !emailBody.trim()
  ) {
    toast.error("Please complete all email fields.");
    return;
  }

  try {
    setEmailSending(true);

    await sendNotification(
      recipientEmails,
      emailSubject,
      emailBody
    );

    setEmailSentSuccess(true);

    toast.success(
      `Security dispatch sent successfully to ${selectedPersonsForEmail.length} recipient(s)`
    );

    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSentSuccess(false);
      setSelectedPersonIds([]);
    }, 1500);
  } catch (error) {
    console.error(error);
    toast.error("Failed to send email.");
  } finally {
    setEmailSending(false);
  }
};
  return (
    <div className="py-6 px-4 flex flex-col gap-6 max-w-7xl mx-auto pb-16 text-foreground min-h-screen">
      <Toaster position="bottom-right" richColors />

      {/* Header / Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <button
            onClick={() => router.push("/client/settings/notification")}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-all mb-2 cursor-pointer group"
            id="back-to-alerts-btn"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Alert Board
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Notification Resolution</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Analyze alert logs and coordinate real-time dispatch responses.
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Notification Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="overflow-hidden border border-border/80 bg-card/65 shadow-md">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Alert Source Details</span>
                {notification && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium tracking-wide border uppercase ${
                    notification.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    notification.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-muted/40 text-muted-foreground border-border/20"
                  }`}>
                    {notification.status}
                  </span>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {loadingNotification ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="size-8 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">Loading log metadata...</span>
                </div>
              ) : notification ? (
                <>
                  {/* Camera Snapshot Capture */}
                  <div className="relative aspect-square w-full bg-black/40 rounded-lg overflow-hidden border border-border/30 group">
                    <img
                      src={notification.data.crop}
                      alt="Alert capture snapshot"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 border border-white/10 px-2.5 py-1 rounded text-white text-[10px]">
                      <Camera className="size-3.5 text-primary" />
                      <span className="font-semibold">CAM SOURCE: {notification.data.camera_id}</span>
                    </div>
                  </div>

                  {/* Metadata Details */}
                  <div className="space-y-3 bg-muted/30 border border-border/40 p-4 rounded-lg">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                      <span className="text-xs text-muted-foreground">Event Classification</span>
                      <div className="flex items-center gap-2">
                        {serviceConfig?.icon}
                        <span className={`px-2.5 py-0.5 rounded border text-[10px] font-semibold uppercase ${serviceConfig?.badgeBg}`}>
                          {serviceConfig?.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5 text-muted-foreground" /> Logged Timestamp
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {formatDate(notification.data.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
                      <span className="text-xs text-muted-foreground">Notification ID</span>
                      <span className="text-xs font-mono bg-muted/80 px-1.5 py-0.5 rounded text-[10px] select-all max-w-[180px] truncate" title={notification.id}>
                        {notification.id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Primary Detected Name</span>
                      <span className="text-xs font-bold text-foreground capitalize">
                        {notification.data.name === "unknow" ? "Unknown Person" : (notification.data.name || "N/A")}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <AlertTriangle className="size-6 text-amber-500" />
                  <span className="text-xs">No active log found for ID {params.id}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security Persons Listing (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-border/80 bg-card/65 shadow-md flex-1 flex flex-col justify-between">
            <div>
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-border/30">
                <div>
                  <CardTitle className="text-sm font-semibold">Security Responders</CardTitle>
                  <CardDescription className="text-[10px] mt-0.5">
                    Coordinators on standby to receive automated email alerts.
                  </CardDescription>
                </div>
                
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  size="xs"
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  id="add-person-trigger-btn"
                >
                  <Plus className="size-3.5" />
                  Add Responder
                </Button>
              </CardHeader>

              <CardContent className="p-5">
                {loadingPersons ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-8 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">Loading active directory...</span>
                  </div>
                ) : persons.length === 0 ? (
                  <div className="border border-dashed border-border/85 rounded-xl p-12 text-center flex flex-col items-center justify-center bg-muted/15">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-3">
                      <User className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-xs text-foreground">No responders defined</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
                      Add contact details of dispatch staff to enable notifications sending.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    
                    {/* Select All Responders and Bulk Action Bar */}
                    <div className="flex items-center gap-2 bg-muted/40 border border-border/40 px-3 py-2 rounded-lg justify-between select-none">
                      <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase cursor-pointer">
                        <button
                          type="button"
                          onClick={handleSelectAllToggle}
                          className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                          id="select-all-checkbox"
                          title="Select / Deselect All Responders"
                        >
                          {selectedPersonIds.length === persons.length ? (
                            <CheckSquare className="size-4 text-primary" />
                          ) : (
                            <Square className="size-4 text-muted-foreground/60" />
                          )}
                        </button>
                        <span>Select All ({selectedPersonIds.length} / {persons.length})</span>
                      </label>
                      
                      {selectedPersonIds.length > 0 && (
                        <Button
                          onClick={handleOpenEmailModalForSelected}
                          size="xs"
                          disabled={!notification}
                          className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer animate-in fade-in slide-in-from-right-3 duration-250"
                          id="send-bulk-email-btn"
                        >
                          <Mail className="size-3.5" />
                          Send Alert to Selected ({selectedPersonIds.length})
                        </Button>
                      )}
                    </div>

                    {/* Responders Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {persons.map((person, index) => {
                        const personKey = person.id || person.email;
                        const isSelected = selectedPersonIds.includes(personKey);
                        
                        return (
                          <div
                            key={personKey}
                            onClick={() => togglePersonSelection(personKey)}
                            className={`border rounded-xl p-4 flex flex-col justify-between shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative group ${
                              isSelected 
                                ? "bg-primary/5 border-primary/45 shadow-sm" 
                                : "bg-card border-border/50 hover:border-primary/30"
                            }`}
                          >
                            {/* Selection Checkbox indicator overlay */}
                            <div className="absolute top-3 right-3 text-primary transition-opacity">
                              {isSelected ? (
                                <CheckSquare className="size-4" />
                              ) : (
                                <Square className="size-4 opacity-30 group-hover:opacity-60 transition-opacity" />
                              )}
                            </div>

                            <div>
                              <div className="flex justify-between items-start mb-2.5 pr-6">
                                <h4 className="text-xs font-semibold text-foreground truncate max-w-[110px]" title={person.name}>
                                  {person.name}
                                </h4>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                                  person.status ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground"
                                }`}>
                                  {person.status ? "ACTIVE" : "INACTIVE"}
                                </span>
                              </div>

                              <div className="space-y-1.5 text-[10px] text-muted-foreground mb-4">
                                <p className="flex items-center gap-2 truncate">
                                  <Mail className="size-3.5 text-muted-foreground/60 shrink-0" />
                                  <span className="select-all" title={person.email}>{person.email}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <Phone className="size-3.5 text-muted-foreground/60 shrink-0" />
                                  <span className="select-all">{person.phone}</span>
                                </p>
                              </div>
                            </div>

                            {/* Direct single action button */}
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent card toggling
                                handleOpenEmailModalForSingle(person);
                              }}
                              size="xs"
                              variant="outline"
                              disabled={!notification}
                              className="w-full bg-muted/20 hover:bg-primary hover:text-primary-foreground border-border/60 transition-colors text-[10px] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                              id={`send-email-btn-${person.id || index}`}
                            >
                              <MailOpen className="size-3.5" />
                              Send Email Directly
                            </Button>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Security Person Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-200 animate-in fade-in">
          <div className="bg-card border border-border/80 max-w-md w-full rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/25">
              <div className="flex items-center gap-2 text-primary">
                <User className="size-4" />
                <h3 className="font-semibold text-xs uppercase tracking-wider">Add Security Responder</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                id="close-add-modal-btn"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddPerson} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-2 px-3 text-xs outline-hidden transition-all"
                  id="add-person-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. security@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-2 px-3 text-xs outline-hidden transition-all"
                  id="add-person-email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +1 555-0199"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-2 px-3 text-xs outline-hidden transition-all"
                  id="add-person-phone"
                />
              </div>

              <div className="pt-3 border-t border-border/20 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 text-xs cursor-pointer"
                  disabled={addLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  disabled={addLoading}
                  id="add-person-submit-btn"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Responder"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {isEmailModalOpen && selectedPersonsForEmail.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-200 animate-in fade-in ">
          <div className="bg-card border border-border/80 max-w-xl w-full rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 h-[90%] overflow-y-auto duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/25">
              <div className="flex items-center gap-2 text-primary">
                <Mail className="size-4" />
                <h3 className="font-semibold text-xs uppercase tracking-wider">Alert Dispatch Center</h3>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                disabled={emailSending}
                id="close-email-modal-btn"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Email Composer Form */}
            <form onSubmit={handleSendEmailSubmit} className="p-5 space-y-4">
              
              {/* Dispatch Action Panel */}
              <div className="bg-muted/40 border border-border/50 rounded-lg p-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Smart Fill</p>
                  <p className="text-[9px] text-muted-foreground">Load surveillance metadata logs instantly into the email body.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAutoFill}
                  disabled={emailSending || !notification}
                  className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  id="autofill-email-btn"
                >
                  <Sparkles className="size-3" />
                  Load Logs
                </Button>
              </div>

              {/* Recipient Details */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Send To ({selectedPersonsForEmail.length} recipient(s))</label>
                <input
                  type="text"
                  required
                  value={recipientEmails}
                  onChange={(e) => setRecipientEmails(e.target.value)}
                  placeholder="Enter comma-separated emails..."
                  className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-2 px-3 text-xs outline-hidden transition-all"
                  disabled={emailSending}
                  id="email-to-field"
                />

                {/* Recipient Profile List Badges */}
                <div className="flex flex-wrap gap-1 mt-1 max-h-24 overflow-y-auto border border-border/20 p-1.5 rounded-md bg-muted/10">
                  {selectedPersonsForEmail.map((p, idx) => (
                    <span 
                      key={p.id || idx} 
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary-foreground border border-primary/15 text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      <User className="size-2.5 shrink-0 text-primary" />
                      <span>{p.name} ({p.email})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Subject Line</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Danger Alert"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-2 px-3 text-xs outline-hidden transition-all"
                  disabled={emailSending}
                  id="email-subject-field"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Message Details</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write your email body message here, or use 'Load Logs' to autofill details..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-muted/40 hover:bg-muted/65 focus:bg-muted/90 border border-border/60 focus:border-primary/50 rounded-lg py-2 px-3 text-xs outline-hidden transition-all resize-none font-mono text-[11px] leading-relaxed"
                  disabled={emailSending}
                  id="email-body-field"
                />
              </div>

              {/* Action Buttons & Progress states */}
              <div className="pt-3 border-t border-border/20 flex items-center justify-between">
                
                {/* Success Indicator / Loading sequence */}
                <div className="flex-1 mr-4">
                  {emailSending && (
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                      <Loader2 className="size-4 animate-spin shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider animate-pulse">Sending Dispatch Mail...</span>
                    </div>
                  )}
                  {emailSentSuccess && (
                    <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Dispatch Transmitted!</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="text-xs cursor-pointer"
                    disabled={emailSending}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    disabled={emailSending || emailSentSuccess}
                    id="email-submit-btn"
                  >
                    <Send className="size-3.5" />
                    Transmit Email
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResolveNotificationPage;
