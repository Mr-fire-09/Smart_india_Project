import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatsCard } from "@/components/stats-card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Users, AlertTriangle, TrendingUp, LogOut, LayoutDashboard, Clock, Eye, Star, Send, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Application, Notification, User as UserType, Department } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ApplicationDetailsDialog } from "@/components/application-details-dialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedOfficial, setSelectedOfficial] = useState<UserType | null>(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [officialSearch, setOfficialSearch] = useState("");
  const [minRatingFilter, setMinRatingFilter] = useState(0);

  const { data: applications, isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications/all"],
  });

  const { data: officials, isLoading: officialsLoading } = useQuery<UserType[]>({
    queryKey: ["/api/users/officials"],
  });

  const { data: departments, isLoading: deptsLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000,
  });

  const handleMarkAsRead = async (id: string) => {
    await apiRequest("POST", `/api/notifications/${id}/read`, {});
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleSendWarning = async () => {
    if (!selectedOfficial || !warningMessage) return;
    try {
      await apiRequest("POST", "/api/warnings", {
        officialId: selectedOfficial.id,
        message: warningMessage,
      });
      toast({ title: "Warning Sent", description: "The official has been notified." });
      setIsWarningOpen(false);
      setWarningMessage("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAddDepartment = async () => {
    try {
      await apiRequest("POST", "/api/departments", {
        name: newDeptName,
        description: newDeptDesc,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsAddDeptOpen(false);
      setNewDeptName("");
      setNewDeptDesc("");
      toast({ title: "Success", description: "Department created successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredOfficials = officials?.filter(o => {
    const matchesSearch = o.fullName.toLowerCase().includes(officialSearch.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(officialSearch.toLowerCase()));
    const matchesRating = (o.rating || 0) >= minRatingFilter;
    return matchesSearch && matchesRating;
  });

  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app =>
    ["Submitted", "Assigned", "In Progress"].includes(app.status)
  ).length || 0;
  const delayedApplications = applications?.filter(app => {
    const daysSinceSubmission = Math.floor(
      (Date.now() - new Date(app.submittedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceSubmission > 20 && !["Approved", "Rejected", "Auto-Approved"].includes(app.status);
  }).length || 0;

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const statusColors: Record<string, string> = {
    "Submitted": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Assigned": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "Approved": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Rejected": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "Auto-Approved": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Sidebar className="bg-white/95 dark:bg-slate-950/95 border-r border-gray-200 dark:border-gray-800">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="hover:bg-blue-50 dark:hover:bg-blue-950/50">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="hover:bg-blue-50 dark:hover:bg-blue-950/50">
                      <FileText className="h-4 w-4" />
                      <span>Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="hover:bg-blue-50 dark:hover:bg-blue-950/50">
                      <Users className="h-4 w-4" />
                      <span>Officials</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="hover:bg-blue-50 dark:hover:bg-blue-950/50">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Delay Monitor</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-white/95 dark:bg-slate-950/95 border-gray-200 dark:border-gray-800 shadow-sm">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <NotificationBell notifications={notifications} onMarkAsRead={handleMarkAsRead} />
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">System overview and monitoring</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="officials">Officials</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatsCard title="Total Applications" value={totalApplications} icon={FileText} />
                  <StatsCard title="Pending" value={pendingApplications} icon={Clock} />
                  <StatsCard title="Delayed" value={delayedApplications} icon={AlertTriangle} />
                  <StatsCard title="Officials" value={officials?.length || 0} icon={Users} />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Recent Applications</CardTitle>
                    <CardDescription>Overview of all applications in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tracking ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Official</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications?.slice(0, 10).map(app => (
                            <TableRow key={app.id}>
                              <TableCell className="font-mono text-sm">{app.trackingId}</TableCell>
                              <TableCell>{app.applicationType}</TableCell>
                              <TableCell>
                                <Badge className={statusColors[app.status]}>{app.status}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
                              </TableCell>
                              <TableCell className="text-sm">
                                {(() => {
                                  const assignedOfficial = officials?.find(o => o.id === app.officialId);
                                  return assignedOfficial ? (
                                    <div className="flex flex-col">
                                      <span className="font-medium">{assignedOfficial.fullName}</span>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                        {assignedOfficial.rating?.toFixed(1) || "0.0"}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">Unassigned</span>
                                  );
                                })()}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="departments" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setIsAddDeptOpen(true)}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Department
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {departments?.map(dept => (
                    <Card key={dept.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedDepartment(dept)}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          {dept.name}
                        </CardTitle>
                        <CardDescription>{dept.description || "No description available"}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Officials</Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {(!departments || departments.length === 0) && (
                    <div className="col-span-3 text-center py-10 text-muted-foreground">
                      No departments found.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="officials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Officials</CardTitle>
                    <CardDescription>Manage and monitor official performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <Label>Search</Label>
                        <Input
                          placeholder="Search by name or email..."
                          value={officialSearch}
                          onChange={(e) => setOfficialSearch(e.target.value)}
                        />
                      </div>
                      <div className="w-48">
                        <Label>Min Rating</Label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={minRatingFilter}
                          onChange={(e) => setMinRatingFilter(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Assigned</TableHead>
                          <TableHead>Solved</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOfficials?.map(official => (
                          <TableRow key={official.id}>
                            <TableCell className="font-medium">{official.fullName}</TableCell>
                            <TableCell>{official.department || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {official.rating?.toFixed(1) || "0.0"}
                              </div>
                            </TableCell>
                            <TableCell>{official.assignedCount || 0}</TableCell>
                            <TableCell>{official.solvedCount || 0}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedOfficial(official);
                                setIsWarningOpen(true);
                              }}>
                                <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                                Warning
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <ApplicationDetailsDialog
        application={selectedApp}
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        canUpdateStatus={false}
      />

      {/* Department Officials Dialog */}
      <Dialog open={!!selectedDepartment} onOpenChange={(open) => !open && setSelectedDepartment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDepartment?.name} - Officials</DialogTitle>
            <DialogDescription>List of officials in this department</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Solved</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {officials?.filter(o =>
                o.department && selectedDepartment &&
                (o.department === selectedDepartment.name || o.department.startsWith(selectedDepartment.name))
              ).map(official => (
                <TableRow key={official.id}>
                  <TableCell className="font-medium">{official.fullName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {official.rating?.toFixed(1) || "0.0"}
                    </div>
                  </TableCell>
                  <TableCell>{official.assignedCount || 0}</TableCell>
                  <TableCell>{official.solvedCount || 0}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedOfficial(official);
                      setIsWarningOpen(true);
                    }}>
                      <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                      Warning
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Warning</DialogTitle>
            <DialogDescription>
              Send a warning notification to {selectedOfficial?.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Warning Message</Label>
              <Textarea
                placeholder="Enter warning message..."
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWarningOpen(false)}>Cancel</Button>
            <Button onClick={handleSendWarning} className="bg-red-600 hover:bg-red-700">
              <Send className="h-4 w-4 mr-2" />
              Send Warning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Department Dialog */}
      <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
            <DialogDescription>Create a new department.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Department Name</Label>
              <Input
                placeholder="e.g. Health, Education..."
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Department description..."
                value={newDeptDesc}
                onChange={(e) => setNewDeptDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDeptOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDepartment}>Create Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
