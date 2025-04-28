"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Our Location",
      details: "285 Đội Cấn, Ba Đình, Hanoi, Vietnam"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      details: "support@slom-vietnam.com"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call or Text Us",
      details: "(+84) 123-456-7890"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Video Support Hours",
      details: "Monday - Friday, 8AM - 8PM GMT+7"
    }
  ];

  return (
    <div className="container max-w-6xl py-8 mx-auto text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Get In Touch</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about sign language classes or need technical assistance? Our support team is here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
        {contactInfo.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "p-6 rounded-lg flex gap-4 border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            )}
          >
            <div className={cn(
              "p-3 h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              isDarkMode ? "bg-gray-700 text-primary" : "bg-primary/10 text-primary"
            )}>
              {item.icon}
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg mb-1">{item.title}</h3>
              <p className="text-muted-foreground">{item.details}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className={cn(
        "border max-w-4xl mx-auto",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Fill out the form below, and we&apos;ll respond within 24 hours. For immediate assistance, please schedule a video call.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full md:w-auto"
              >
                Schedule Video Call
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}