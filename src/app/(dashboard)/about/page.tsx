"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  const { isDarkMode } = useTheme();

  const team = [
    {
      name: "Nguyen Van Minh",
      role: "CEO & Founder",
      image: "https://i.pravatar.cc/150?u=minh",
      initials: "NVM"
    },
    {
      name: "Tran Thi Lan",
      role: "Sign Language Expert",
      image: "https://i.pravatar.cc/150?u=lan",
      initials: "TTL"
    },
    {
      name: "Le Quoc Bao",
      role: "Lead Developer",
      image: "https://i.pravatar.cc/150?u=bao",
      initials: "LQB"
    },
    {
      name: "Pham Mai Anh",
      role: "Accessibility Specialist",
      image: "https://i.pravatar.cc/150?u=anh",
      initials: "PMA"
    }
  ];

  return (
    <div className="container max-w-5xl py-8 mx-auto text-center">
      {/* Company Story */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Our Story</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Founded in 2022, SLOM was created to bridge the communication gap for the deaf and hard of hearing community.
        </p>
        
        <div className={cn(
          "p-8 rounded-lg mx-auto text-left",
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50"
        )}>
          <p className="mb-4">
            When our founder, Nguyen Van Minh, witnessed firsthand the challenges his deaf cousin faced in online 
            education during the pandemic, he recognized that existing platforms weren&apos;t designed with sign language 
            communication in mind.
          </p>
          <p className="mb-4">
            Working alongside educators, sign language interpreters, and software developers, we created SLOM - 
            a platform specifically optimized for visual communication that puts the needs of the deaf and hard 
            of hearing community first.
          </p>
          <p>
            Today, SLOM serves thousands of users across Vietnam and Southeast Asia, enabling accessible 
            education and communication for both deaf and hearing individuals learning sign language.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className={cn(
            "border text-left",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          )}>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To make digital communication accessible and inclusive for the deaf and hard of hearing community by 
                creating technology specifically designed for sign language interaction and learning.
              </p>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "border text-left",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          )}>
            <CardHeader>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                A world where communication barriers are eliminated through technology, and sign language is 
                recognized and valued as a vital form of human expression and connection.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our diverse team combines expertise in sign language, education, technology, and accessibility to create 
            an inclusive platform for all users.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}