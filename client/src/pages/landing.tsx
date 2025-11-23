import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Bell, Award, Clock, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl">Digital Governance</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Login</Button>
            </Link>
            <Link href="/register">
              <Button data-testid="button-register">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-heading">
              Transparent Digital Governance
            </h1>
            <p className="text-xl text-muted-foreground">
              Submit, track, and manage government applications with AI-powered monitoring, 
              blockchain verification, and guaranteed 30-day processing
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" data-testid="button-submit-application">
                  Submit Application
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" data-testid="button-track-application">
                  Track Application
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>30-Day Auto-Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>AI-Monitored</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Blockchain Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-heading">Real-time Tracking</CardTitle>
                <CardDescription>
                  Track your application status at every step with detailed timeline and notifications
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-heading">AI Monitoring</CardTitle>
                <CardDescription>
                  Advanced AI detects delays and automatically escalates to ensure timely processing
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-heading">Secure Feedback</CardTitle>
                <CardDescription>
                  OTP-verified feedback system ensures authentic ratings and improves service quality
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: FileText, title: "Submit", desc: "Fill out your application online" },
              { step: 2, icon: Award, title: "Assign", desc: "AI assigns to available official" },
              { step: 3, icon: Bell, title: "Monitor", desc: "Receive real-time status updates" },
              { step: 4, icon: CheckCircle, title: "Approve", desc: "Get verified blockchain certificate" },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                    {step}
                  </div>
                </div>
                <Icon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-heading font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">
            Public Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-3xl text-center text-primary">
                  12,450+
                </CardTitle>
                <CardDescription className="text-center">
                  Applications Processed
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-3xl text-center text-primary">
                  18 Days
                </CardTitle>
                <CardDescription className="text-center">
                  Average Resolution Time
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-3xl text-center text-primary">
                  4.7/5
                </CardTitle>
                <CardDescription className="text-center">
                  Citizen Satisfaction
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Digital Governance Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
