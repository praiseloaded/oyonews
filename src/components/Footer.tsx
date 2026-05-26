'use client';

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const categories = [
    { label: 'News', href: '/category/news' },
    { label: 'Sport', href: '/category/sport' },
    { label: 'Politics', href: '/category/politics' },
    { label: 'Jobs', href: '/category/jobs' },
  ];

  const socialMedia = [
    {
      icon: <Facebook className="h-4 w-4" />,
      href: 'https://facebook.com',
      hover: 'hover:border-blue-500',
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      href: 'https://twitter.com',
      hover: 'hover:border-blue-500',
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      href: 'https://instagram.com',
      hover: 'hover:border-purple-500',
    },
    {
      icon: <Youtube className="h-4 w-4" />,
      href: 'https://youtube.com',
      hover: 'hover:border-red-500',
    },
  ];

  return (
 
    <footer className="bg-gray-900 text-white">
      <div className="container">
           <style>{`div[data-widget-id="1800927"] { min-height: 300px; }`}</style>
      <div data-type="_mgwidget" data-widget-id="1800927"></div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              OyoNews
            </div>
            <p className="text-gray-400 leading-relaxed">
              Nigeria&apos;s premier news platform delivering accurate, timely, and
              engaging content to keep you informed about what matters most.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Social Media</h4>
            <div className="flex space-x-4">
              {socialMedia.map(({ icon, href, hover }, idx) => (
                <a key={idx} href={href} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-gray-600 text-gray-400 hover:text-white ${hover}`}
                  >
                    {icon}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">info@oyonews.com.ng</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">+2347036497139</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">Oyo State, Nigeria</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
           © 2025 Oyo News. All rights reserved
          </p>
          <div className="flex space-x-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
