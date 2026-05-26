'use client';

import { Users, Target, Award, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import MainNav from "@/components/MainNav";

const About = () => {
  const stats = [
    { label: "Monthly Readers", value: "2.5M+", icon: Users },
    { label: "Years of Excellence", value: "8+", icon: Award },
    { label: "Daily Articles", value: "50+", icon: Target },
    { label: "Countries Reached", value: "25+", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainNav />

      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About OyoNews</h1>
            <p className="text-xl md:text-2xl text-red-100 leading-relaxed">
              Nigeria&apos;s leading source for breaking news, entertainment, politics, and sports.
              Delivering accurate, timely, and engaging content to millions of readers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 mx-auto mb-4 text-red-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column (Main Story) */}
          <div className="lg:col-span-2">
            {/* Our Story */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-red-600 mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Founded in 2020, OyoNews began as a small blog with a big vision: to become Nigeria&apos;s
                  most trusted and comprehensive news source. What started as a passion project by a group
                  of dedicated journalists has grown into one of the country&apos;s most visited news websites.
                </p>
                <p className="mb-4">
                  One thing you would take away from us is “Ingenuity &amp; Originality.” Our stories are timely and authentic.
                  We feed you with current happenings round Oyo State and Nigeria. We thirst for more.
                </p>
                <p className="mb-4">
                  We pride ourselves on delivering breaking news as it happens, providing in-depth analysis
                  of political developments, covering the vibrant Nigerian entertainment industry, and
                  keeping our readers updated on sports from local leagues to international competitions.
                </p>
                <p className="mb-4">
                  Our commitment to journalistic integrity, accuracy, and timely reporting has earned us
                  the trust of millions of readers across Nigeria and the diaspora. We believe in the
                  power of information to transform lives and communities.
                </p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To inform, educate, and empower our readers with accurate, timely, and relevant news
                    that matters to their daily lives and Nigeria&apos;s future.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To be Africa&apos;s leading digital news platform, setting the standard for quality
                    journalism and innovative storytelling in the digital age.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdBanner size="sidebar" position="sidebar" />

            {/* Awards */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-red-600">Awards &amp; Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-600 pl-4">
                    <h4 className="font-semibold">Best Digital News Platform 2023</h4>
                    <p className="text-sm text-gray-600">Nigerian Media Awards</p>
                  </div>
                  <div className="border-l-4 border-red-600 pl-4">
                    <h4 className="font-semibold">Excellence in Sports Journalism 2022</h4>
                    <p className="text-sm text-gray-600">Sports Writers Association</p>
                  </div>
                  <div className="border-l-4 border-red-600 pl-4">
                    <h4 className="font-semibold">Rising Digital Media Company 2021</h4>
                    <p className="text-sm text-gray-600">African Digital Awards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-red-600">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Email:</strong> info@oyonews.com.ng
                  </div>
                  <div>
                    <strong>Phone:</strong> +234 123 456 7890
                  </div>
                  <div>
                    <strong>Address:</strong> 123 Media Street, Victoria Island, Lagos, Nigeria
                  </div>
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

export default About;
