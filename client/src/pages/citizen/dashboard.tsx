import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationCard } from "@/components/application-card";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Plus, Search, LogOut, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Application, Notification } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications/my"],
    refetchInterval: 5000,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000,
  });

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const handleMarkAsRead = async (id: string) => {
    await apiRequest("POST", `/api/notifications/${id}/read`, {});
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleViewDetails = (id: string) => {
    setLocation(`/citizen/application/${id}`);
  };

  // Debug logging
  // console.log("Current filter:", filterStatus);
  // console.log("Filtered apps count:", filteredApplications?.length);

  // Filter applications based on selected status
  const filteredApplications = (applications?.filter(app => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return ["Submitted", "Assigned", "In Progress"].includes(app.status);
    if (filterStatus === "approved") return ["Approved", "Auto-Approved"].includes(app.status);
    if (filterStatus === "rejected") return app.status === "Rejected";
    return true;
  }) || []).sort((a, b) => a.trackingId.localeCompare(b.trackingId));

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(app => ["Submitted", "Assigned", "In Progress"].includes(app.status)).length || 0,
    approved: applications?.filter(app => ["Approved", "Auto-Approved"].includes(app.status)).length || 0,
    rejected: applications?.filter(app => app.status === "Rejected").length || 0
  };

  // Scroll to applications list when filter changes
  useEffect(() => {
    const element = document.getElementById("applications-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filterStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Digital Governance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell notifications={notifications} onMarkAsRead={handleMarkAsRead} />
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your applications and track their progress</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${filterStatus === 'all' ? 'ring-2 ring-blue-500 ring-offset-2' : ''} bg-gradient-to-br from-blue-500 to-blue-600 text-white`}
            onClick={() => setFilterStatus("all")}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-100 text-xs font-medium">Total Applications</CardDescription>
              <CardTitle className="text-4xl font-bold">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">All submissions</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${filterStatus === 'pending' ? 'ring-2 ring-orange-500 ring-offset-2' : ''} bg-gradient-to-br from-orange-500 to-orange-600 text-white`}
            onClick={() => setFilterStatus("pending")}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-orange-100 text-xs font-medium">Pending</CardDescription>
              <CardTitle className="text-4xl font-bold">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">In progress</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${filterStatus === 'approved' ? 'ring-2 ring-green-500 ring-offset-2' : ''} bg-gradient-to-br from-green-500 to-green-600 text-white`}
            onClick={() => setFilterStatus("approved")}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-green-100 text-xs font-medium">Approved</CardDescription>
              <CardTitle className="text-4xl font-bold">{stats.approved}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Completed</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${filterStatus === 'rejected' ? 'ring-2 ring-red-500 ring-offset-2' : ''} bg-gradient-to-br from-red-500 to-red-600 text-white`}
            onClick={() => setFilterStatus("rejected")}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-red-100 text-xs font-medium">Rejected</CardDescription>
              <CardTitle className="text-4xl font-bold">{stats.rejected}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                <span className="text-sm">Not approved</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50" onClick={() => setLocation("/citizen/submit")} data-testid="card-new-application">
            <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0">
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <Plus className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-heading text-blue-900 dark:text-blue-100">New Application</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">Submit a new government application</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50" onClick={() => setLocation("/citizen/track")} data-testid="card-track-application">
            <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0">
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Search className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-heading text-purple-900 dark:text-purple-100">Track Application</CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">Search by tracking ID</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4" id="applications-list">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-gray-100">
              Applications
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              All ({stats.total})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Pending ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              onClick={() => setFilterStatus("approved")}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approved ({stats.approved})
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              onClick={() => setFilterStatus("rejected")}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Rejected ({stats.rejected})
            </Button>
          </div>

          {applicationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No applications found for this category.
                </p>
                {filterStatus === 'all' && (
                  <Button className="mt-4" onClick={() => setLocation("/citizen/submit")} data-testid="button-submit-first">
                    Submit Application
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplications.map(app => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={() => handleViewDetails(app.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
