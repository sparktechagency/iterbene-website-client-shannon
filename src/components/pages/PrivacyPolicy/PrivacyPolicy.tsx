import React from "react";
import { Shield, Eye, Lock, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Shield className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Privacy Policy</h2>
          <p className="text-xl opacity-90">
            Your privacy is our priority. Learn how we protect and handle your
            personal information.
          </p>
          <p className="mt-4 text-blue-100">Last updated: January 15, 2025</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Introduction</h3>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Welcome to Iterbene, a travel-focused social media platform. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and mobile
              applications. We are committed to protecting your privacy and
              ensuring transparency in our data practices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using Iterbene, you agree to the collection and use of
              information in accordance with this policy. If you disagree with
              any part of this policy, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Information We Collect
              </h3>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Personal Information
                </h4>
                <p className="text-gray-600 mb-3">
                  When you create an account, we collect:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Full name and username</li>
                  <li>• Email address</li>
                  <li>• Phone number (optional)</li>
                  <li>• Profile picture and bio</li>
                  <li>• Date of birth</li>
                  <li>• Location information (if provided)</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Content Information
                </h4>
                <p className="text-gray-600 mb-3">
                  When you use our platform, we collect:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Photos, videos, and text posts you share</li>
                  <li>• Comments, likes, and interactions</li>
                  <li>• Travel itineraries and location data</li>
                  <li>• Messages and communications</li>
                  <li>• Reviews and ratings</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Technical Information
                </h4>
                <p className="text-gray-600 mb-3">We automatically collect:</p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Device information and IP address</li>
                  <li>• Browser type and version</li>
                  <li>• Usage patterns and preferences</li>
                  <li>• Log data and analytics</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                How We Use Your Information
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Core Platform Services
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Provide and maintain our social media platform</li>
                <li>• Enable content sharing and social interactions</li>
                <li>• Facilitate communication between users</li>
                <li>• Personalize your experience and recommendations</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Communication & Support
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Send important service notifications</li>
                <li>• Provide customer support</li>
                <li>• Share platform updates and features</li>
                <li>• Respond to your inquiries</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Security & Compliance
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Protect against fraud and abuse</li>
                <li>• Ensure platform security</li>
                <li>• Comply with legal obligations</li>
                <li>• Improve our services through analytics</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Information Sharing
              </h3>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                We Never Sell Your Data
              </h4>
              <p className="text-gray-600">
                Iterbene does not sell, rent, or trade your personal information
                to third parties for marketing purposes.
              </p>
            </div>

            <p className="text-gray-600 mb-4">
              We may share your information only in the following circumstances:
            </p>
            <ul className="text-gray-600 space-y-3">
              <li>
                • <strong>With Other Users:</strong> Content you choose to share
                publicly
              </li>
              <li>
                • <strong>Service Providers:</strong> Trusted partners who help
                us operate our platform
              </li>
              <li>
                • <strong>Legal Requirements:</strong> When required by law or
                to protect our rights
              </li>
              <li>
                • <strong>Business Transfers:</strong> In case of merger,
                acquisition, or sale of assets
              </li>
              <li>
                • <strong>With Consent:</strong> When you explicitly authorize
                sharing
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Data Security
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              We implement industry-standard security measures to protect your
              personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Technical Safeguards
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• SSL encryption for data transmission</li>
                  <li>• Secure server infrastructure</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and authentication</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Operational Security
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Employee training and background checks</li>
                  <li>• Limited access to personal data</li>
                  <li>• Incident response procedures</li>
                  <li>• Regular backup and recovery testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Your Rights & Choices
              </h3>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                You have the right to:
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-gray-600 space-y-2">
                  <li>• Access your personal information</li>
                  <li>• Correct inaccurate data</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                </ul>
                <ul className="text-gray-600 space-y-2">
                  <li>• Control privacy settings</li>
                  <li>• Opt out of communications</li>
                  <li>• Restrict data processing</li>
                  <li>• File complaints with authorities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies Policy */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Cookies & Tracking
            </h3>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your
              experience, analyze usage patterns, and provide personalized
              content. You can manage cookie preferences through your browser
              settings.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Cookie Types:</strong> Essential cookies (required for
                functionality), analytics cookies (usage statistics), and
                preference cookies (personalization).
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h3>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: privacy@iterbene.com</p>
              <p>Address: Iterbene Privacy Team, [Your Company Address]</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We will respond to your privacy inquiries within 30 days.
            </p>
          </section>
        </div>
      </div>

    </div>
  );
}
