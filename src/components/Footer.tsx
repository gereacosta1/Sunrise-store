import React from 'react';
import { Zap, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Catalog', href: '#catalog' },
    { name: 'Financing', href: '#financing' },
    { name: 'Contact', href: '#contact' },
  ];

  const categories = [
    { name: 'Electric Scooters', href: '#' },
    { name: 'Electric Motorcycles', href: '#' },
    { name: 'Accessories', href: '#' },
    { name: 'Parts', href: '#' },
  ];

  const support = [
    { name: 'Help Center', href: '#' },
    { name: 'Warranty', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-b from-orange-600 to-orange-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-xl">
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
              <span className="text-3xl font-bold">Sunrise Store</span>
            </div>

            <p className="text-orange-100 leading-relaxed max-w-md">
              Leading the electric mobility revolution with premium products and exceptional service since 2021.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-200" />
                <span className="text-orange-100">info@sunrisestore.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-200" />
                <span className="text-orange-100">305-833-0092</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-200" />
                <span className="text-orange-100">11510 Biscayne Blvd, Miami, FL 33181</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-orange-100 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <a
                    href={category.href}
                    className="text-orange-100 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-orange-100 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-orange-500/30 pt-12 mb-12">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay up to date</h3>
            <p className="text-orange-100 mb-6">
              Get the latest news and special offers.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <button className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-orange-500/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-orange-100 text-center md:text-left">
              © 2025 Sunrise Store. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
