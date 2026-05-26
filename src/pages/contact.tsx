"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import MainNav from "@/components/MainNav";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "info@oyonews.com.ng",
      description: "Get in touch via email",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+2347036497139",
      description: "Monday to Friday, 9AM - 6PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Oyo State, Nigeria",
      description: "Our office location",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "Saturday: 10:00 AM - 2:00 PM",
    },
  ];

  const departments = [
    "General Inquiry",
    "News Tip",
    "Advertising",
    "Technical Support",
    "Editorial",
    "Partnership",
    "Complaints",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainNav />

      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-red-100 leading-relaxed">
            Get in touch with our team. We&apos;d love to hear from you and are here to help with any questions or concerns.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we’ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Message subject"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept.toLowerCase().replace(/\s+/g, "-")}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Write your message here..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">How can I submit a news tip?</h3>
                  <p className="text-gray-600">
                    You can submit news tips through our contact form by selecting &quot;News Tip&quot;, or email tips@oyonews.com.ng.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">How do I advertise on OyoNews?</h3>
                  <p className="text-gray-600">
                    Select &quot;Advertising&quot; in the form or contact our team directly at ads@oyonews.com.ng.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">What are your response times?</h3>
                  <p className="text-gray-600">
                    We usually reply within 24–48 business hours. Urgent tips are prioritized immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                        <p className="text-gray-700 font-medium mb-1">{info.content}</p>
                        <p className="text-gray-500 text-sm">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="mt-8">
              <AdBanner size="sidebar" position="sidebar" />
            </div>

            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-600">Follow Us</CardTitle>
                <CardDescription>Stay connected on social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Facebook
                  </Button>
                  <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-50">
                    Twitter
                  </Button>
                  <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                    Instagram
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
