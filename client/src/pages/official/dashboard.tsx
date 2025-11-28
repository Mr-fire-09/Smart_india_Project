import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationCard } from "@/components/application-card";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatsCard } from "@/components/stats-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { FileText, CheckCircle, Clock, TrendingUp, LogOut, LayoutDashboard, AlertTriangle, Search, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Application, Notification } from "@shared/schema";
import { ApplicationDetailsDialog } from "@/components/application-details-dialog";

export default function OfficialDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const [filterStatus, setFilterStatus] = useState<"all" | "assigned" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  // Fetch official's rating
  const { data: ratingStats } = useQuery<{ averageRating: number; totalRatings: number }>({
    queryKey: ["/api/officials", user?.id, "rating"],
    enabled: !!user?.id,
    refetchInterval: 5000, // Auto-update rating every 5 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/applications/${id}/accept`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Application Accepted Successfully",
        description: "This application is now assigned to you. You can view and update its status anytime in My Applications.",
      });
    },
  });

  const handleMarkAsRead = async (id: string) => {
    await apiRequest("POST", `/api/notifications/${id}/read`, {});
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
  };

  const handleAccept = async (id: string) => {
    await acceptMutation.mutateAsync(id);
  };

  const unassignedApps = applications?.filter(app => app.status === "Submitted") || [];
  const myApps = applications?.filter(app => app.officialId === user?.id) || [];
  const pendingApps = myApps.filter(app => app.status === "Assigned" || app.status === "In Progress");
  const completedToday = myApps.filter(app =>
    app.approvedAt && new Date(app.approvedAt).toDateString() === new Date().toDateString()
  ).length;

  // Filter myApps based on selection and search
  const filteredMyApps = myApps.filter(app => {
    // Search filter
    if (searchQuery && !app.trackingId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterStatus === "all") return true;
    if (filterStatus === "assigned") return true; // "Assigned to Me" usually means all assigned apps
    if (filterStatus === "pending") return app.status === "Assigned" || app.status === "In Progress";
    if (filterStatus === "completed") return ["Approved", "Rejected", "Auto-Approved"].includes(app.status);
    return true;
  });

  // Filter unassigned apps based on search
  const filteredUnassignedApps = unassignedApps.filter(app => {
    if (searchQuery && !app.trackingId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Scroll to list when filter changes
  useEffect(() => {
    if (filterStatus !== "all") {
      const element = document.getElementById("official-tabs");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Also switch to "my-apps" tab if not already there
        const myAppsTrigger = document.querySelector('[data-testid="tab-my-applications"]') as HTMLElement;
        if (myAppsTrigger) myAppsTrigger.click();
      }
    }
  }, [filterStatus]);

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Official Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell notifications={notifications} onMarkAsRead={handleMarkAsRead} />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-heading">Welcome back, {user?.fullName}!</h2>
            <p className="text-blue-100">Here's an overview of your assigned applications and performance.</p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              {user?.department && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-sm font-medium text-white">
                    {user.department}
                  </span>
                </div>
              )}
              {ratingStats && ratingStats.totalRatings > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 backdrop-blur-sm rounded-full border border-yellow-400/50">
                  <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                  <span className="text-sm font-bold text-white">
                    {ratingStats.averageRating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-blue-100">
                    ({ratingStats.totalRatings} ratings)
                  </span>
                </div>
              )}
              <Input
                type="search"
                placeholder="Search by Application Number..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => setFilterStatus("assigned")} className="cursor-pointer transition-transform hover:scale-105">
            <Card className={`border-0 shadow-lg ${filterStatus === 'assigned' ? 'ring-2 ring-blue-500 ring-offset-2' : ''} bg-gradient-to-br from-blue-500 to-blue-600 text-white`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-blue-100">Assigned to Me</CardTitle>
                <FileText className="h-4 w-4 text-blue-100" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myApps.length}</div>
              </CardContent>
            </Card>
          </div>
          <div onClick={() => setFilterStatus("pending")} className="cursor-pointer transition-transform hover:scale-105">
            <Card className={`border-0 shadow-lg ${filterStatus === 'pending' ? 'ring-2 ring-orange-500 ring-offset-2' : ''} bg-gradient-to-br from-orange-500 to-orange-600 text-white`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-orange-100">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-orange-100" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingApps.length}</div>
              </CardContent>
            </Card>
          </div>
          <div onClick={() => setFilterStatus("completed")} className="cursor-pointer transition-transform hover:scale-105">
            <Card className={`border-0 shadow-lg ${filterStatus === 'completed' ? 'ring-2 ring-green-500 ring-offset-2' : ''} bg-gradient-to-br from-green-500 to-green-600 text-white`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-green-100">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-100" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedToday}</div>
              </CardContent>
            </Card>
          </div>
          <div className="cursor-pointer transition-transform hover:scale-105">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-purple-100">Avg Processing Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-100" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12 days</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="unassigned" className="w-full" id="official-tabs">
          <TabsList className="bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <TabsTrigger
              value="unassigned"
              data-testid="tab-unassigned"
              className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              Unassigned ({filteredUnassignedApps.length})
            </TabsTrigger>
            <TabsTrigger
              value="my-apps"
              data-testid="tab-my-applications"
              className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              My Applications ({filteredMyApps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unassigned" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredUnassignedApps.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No unassigned applications found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUnassignedApps.map(app => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onViewDetails={() => setSelectedApp(app)}
                    showActions
                    onAccept={() => handleAccept(app.id)}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-apps" className="space-y-4 mt-4">
            {filteredMyApps.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {filterStatus === "all" && !searchQuery ? "No applications assigned to you" : "No applications found"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMyApps.map(app => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onViewDetails={() => setSelectedApp(app)}
                    showActions
                    onUpdate={() => setSelectedApp(app)}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ApplicationDetailsDialog
        application={selectedApp}
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        canUpdateStatus={selectedApp?.officialId === user?.id}
      />
    </div>
  );
}
