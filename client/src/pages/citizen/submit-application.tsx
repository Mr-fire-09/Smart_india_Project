import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SubmitApplication() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicationType: "",
    description: "",
    additionalInfo: "",
    image: "",
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const maxWidth = 1920;
          const maxHeight = 1920;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 70% quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 50MB",
          variant: "destructive",
        });
        e.target.value = ""; // Clear the input
        return;
      }

      try {
        const compressedImage = await compressImage(file);
        setFormData({ ...formData, image: compressedImage });
        toast({
          title: "Image uploaded",
          description: "Image has been compressed and ready to submit",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to process image",
          variant: "destructive",
        });
        e.target.value = "";
      }
    }
  };

  const applicationTypes = [
    "Aadhaar – Unique Identification Authority of India (UIDAI)",
    "Animal Husbandry & Dairying – Department of Animal Husbandry and Dairying",
    "Agriculture – Ministry of Agriculture and Farmers Welfare",
    "CBSE – Central Board of Secondary Education",
    "Central Public Works Department (CPWD)",
    "Consumer Affairs – Department of Consumer Affairs",
    "Corporate Affairs – Ministry of Corporate Affairs",
    "Education – Ministry of Education",
    "Electricity – Ministry of Power",
    "Election Commission of India (ECI)",
    "Employees’ Provident Fund Organisation (EPFO)",
    "Employees’ State Insurance Corporation (ESIC)",
    "Finance – Ministry of Finance",
    "Food & Civil Supplies – Department of Food and Public Distribution",
    "Forest – Ministry of Environment, Forest and Climate Change",
    "Health – Ministry of Health and Family Welfare",
    "Home Affairs – Ministry of Home Affairs",
    "Income Tax Department (CBDT)",
    "Industrial Development – Department for Promotion of Industry and Internal Trade (DPIIT)",
    "Labour – Ministry of Labour and Employment",
    "Minority Affairs – Ministry of Minority Affairs",
    "Municipal Corporation / Urban Local Bodies (ULBs)",
    "Panchayati Raj – Ministry of Panchayati Raj",
    "Passport – Ministry of External Affairs (Passport Seva)",
    "Personnel & Training – Department of Personnel and Training (DoPT)",
    "Police – State Police Department",
    "Pollution – Central Pollution Control Board (CPCB)",
    "Post Office – Department of Posts",
    "Public Grievances – Department of Administrative Reforms and Public Grievances (DARPG)",
    "Public Works – Public Works Department (PWD)",
    "Railways – Ministry of Railways",
    "Revenue – Department of Revenue (Ministry of Finance)",
    "Road Transport – Ministry of Road Transport and Highways (MoRTH)",
    "Rural Development – Ministry of Rural Development",
    "Science & Technology – Ministry of Science and Technology",
    "Skills – Ministry of Skill Development and Entrepreneurship",
    "Social Justice – Ministry of Social Justice and Empowerment",
    "Telecommunications – Department of Telecommunications (DoT)",
    "Urban Development – Ministry of Housing and Urban Affairs (MoHUA)",
    "Water – Ministry of Jal Shakti",
    "Women & Child Development – Ministry of Women and Child Development",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        applicationType: formData.applicationType,
        description: formData.description,
        citizenId: user!.id,
        data: JSON.stringify({ additionalInfo: formData.additionalInfo }),
        image: formData.image || undefined,
      };

      await apiRequest("POST", "/api/applications", data);

      await queryClient.invalidateQueries({ queryKey: ["/api/applications/my"] });

      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. You'll receive updates via notifications.",
      });

      setLocation("/citizen/dashboard");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Unable to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/citizen/dashboard">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-heading font-bold text-xl">Digital Governance</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-2">Submit Application</h1>
            <p className="text-muted-foreground">Fill out the form below to submit your application</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Application Details</CardTitle>
              </div>
              <CardDescription>
                Provide accurate information for faster processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="applicationType">Application Type *</Label>
                  <Select
                    value={formData.applicationType}
                    onValueChange={(value) => setFormData({ ...formData, applicationType: value })}
                    required
                  >
                    <SelectTrigger data-testid="select-application-type">
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your application request in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={5}
                    data-testid="textarea-description"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide clear details about what you're requesting
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional details that might be helpful..."
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    rows={4}
                    data-testid="textarea-additional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image (Optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Images will be compressed to max 1920x1920 pixels at 70% JPEG quality
                  </p>
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="Preview" className="max-h-48 rounded-md border" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-red-500 hover:text-red-700"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-md space-y-2">
                  <h3 className="font-medium text-sm">What happens next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Your application will be assigned to an available official</li>
                    <li>You'll receive notifications at each stage</li>
                    <li>AI monitoring ensures timely processing</li>
                    <li>Auto-approval within 30 days if no action is taken</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Link href="/citizen/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full" data-testid="button-cancel">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                    data-testid="button-submit-application"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
