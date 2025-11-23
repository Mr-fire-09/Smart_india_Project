import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationCard } from "@/components/application-card";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, Plus, Search, LogOut, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Application, Notification } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications/my"],
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

  const handleViewDetails = (id: string) => {
    setLocation(`/citizen/application/${id}`);
  };

  const activeApplications = applications?.filter(app =>
    ["Submitted", "Assigned", "In Progress"].includes(app.status)
  ) || [];

  const completedApplications = applications?.filter(app =>
    ["Approved", "Rejected", "Auto-Approved"].includes(app.status)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl">Digital Governance</span>
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
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-muted-foreground">Manage your applications and track their progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/citizen/submit")} data-testid="card-new-application">
            <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                <Plus className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-heading">New Application</CardTitle>
                <CardDescription>Submit a new government application</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/citizen/track")} data-testid="card-track-application">
            <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                <Search className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="font-heading">Track Application</CardTitle>
                <CardDescription>Search by tracking ID</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold font-heading">Active Applications</h2>
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
          ) : activeApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No active applications. Submit your first application to get started.
                </p>
                <Button className="mt-4" onClick={() => setLocation("/citizen/submit")} data-testid="button-submit-first">
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeApplications.map(app => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={() => handleViewDetails(app.id)}
                />
              ))}
            </div>
          )}
        </div>

        {completedApplications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-heading">Completed Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedApplications.map(app => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onViewDetails={() => handleViewDetails(app.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
