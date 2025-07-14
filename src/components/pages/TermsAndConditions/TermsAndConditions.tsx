import React from "react";
import {
  FileText,
  Scale,
  AlertTriangle,
  Shield,
  Users,
  Camera,
  Ban,
} from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Scale className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Terms and Conditions</h2>
          <p className="text-xl opacity-90">
            Please read these terms carefully before using Iterbene&apos;s travel
            social media platform.
          </p>
          <p className="mt-4 text-indigo-100">Last updated: January 15, 2025</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Acceptance */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Acceptance of Terms
              </h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                By accessing and using Iterbene we us , or our, you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
              <p className="text-gray-700">
                These Terms and Conditions govern your use of our travel-focused
                social media platform, including all content, services, and
                features available through our website and mobile applications.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Camera className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Service Description
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Iterbene is a travel-focused social media platform that allows
              users to share travel experiences, photos, stories, and connect
              with fellow travelers worldwide. Our services include:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Core Features
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Photo and video sharing</li>
                  <li>• Travel story publishing</li>
                  <li>• Social networking features</li>
                  <li>• Location-based content</li>
                  <li>• User profiles and following</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Additional Services
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Travel recommendations</li>
                  <li>• Community forums</li>
                  <li>• Messaging and chat</li>
                  <li>• Event and meetup coordination</li>
                  <li>• Travel planning tools</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                User Accounts and Registration
              </h3>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Account Requirements
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>
                    • You must be at least 13 years old to create an account
                  </li>
                  <li>• You must provide accurate and complete information</li>
                  <li>
                    • You are responsible for maintaining account security
                  </li>
                  <li>• One person may not maintain multiple accounts</li>
                  <li>• You must keep your contact information updated</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Account Responsibilities
                </h4>
                <p className="text-gray-600 mb-3">
                  You are solely responsible for all activities that occur under
                  your account. This includes:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Safeguarding your password and login credentials</li>
                  <li>• All content posted through your account</li>
                  <li>• Interactions with other users</li>
                  <li>• Compliance with these terms and applicable laws</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Content */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                User Content and Conduct
              </h3>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Content Ownership
              </h4>
              <p className="text-gray-600">
                You retain ownership of all content you post on Iterbene.
                However, by posting content, you grant us a non-exclusive,
                worldwide, royalty-free license to use, modify, distribute, and
                display your content in connection with our services.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Content Standards
              </h4>
              <p className="text-gray-600 mb-3">
                All content must comply with our community guidelines:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Must be travel-related or relevant to our community</li>
                <li>
                  • Must not infringe on others&apos; intellectual property rights
                </li>
                <li>• Must be accurate and not misleading</li>
                <li>• Must respect privacy of individuals in photos/videos</li>
                <li>• Must comply with applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Ban className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Prohibited Activities
              </h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                You may not use Iterbene to:
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">
                    Content Violations
                  </h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Post illegal, harmful, or offensive content</li>
                    <li>• Share copyrighted material without permission</li>
                    <li>• Distribute spam or promotional content</li>
                    <li>• Post false or misleading information</li>
                    <li>• Share inappropriate or adult content</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">
                    Platform Misuse
                  </h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Harass, bully, or threaten other users</li>
                    <li>• Impersonate others or create fake accounts</li>
                    <li>• Attempt to hack or disrupt our services</li>
                    <li>• Collect user data without permission</li>
                    <li>• Use automated tools or bots</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Intellectual Property Rights
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Our Rights
                </h4>
                <p className="text-gray-600">
                  The Iterbene platform, including its design, functionality,
                  trademarks, and proprietary technology, is owned by us and
                  protected by copyright, trademark, and other intellectual
                  property laws.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Respect for Others&apos; Rights
                </h4>
                <p className="text-gray-600">
                  We respect intellectual property rights and expect our users
                  to do the same. If you believe your copyright has been
                  infringed, please contact us with detailed information about
                  the alleged infringement.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Privacy and Data Protection
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how
              we collect, use, and protect your personal information. By using
              our services, you also agree to our Privacy Policy.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Key Privacy Points
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li>• We collect information you provide and usage data</li>
                <li>
                  • We use data to improve our services and user experience
                </li>
                <li>
                  • We implement security measures to protect your information
                </li>
                <li>• You have rights regarding your personal data</li>
                <li>
                  • We may share data only as described in our Privacy Policy
                </li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Disclaimers and Limitations
              </h3>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Service Availability
              </h4>
              <p className="text-gray-600">
                We strive to provide reliable service but cannot guarantee
                uninterrupted availability. We may modify, suspend, or
                discontinue services at any time without notice.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                User-Generated Content
              </h4>
              <p className="text-gray-600">
                Travel information and recommendations shared by users are their
                personal experiences and opinions. We do not endorse or
                guarantee the accuracy of user-generated content. Always verify
                travel information independently.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Ban className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Account Termination
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  By You
                </h4>
                <p className="text-gray-600">
                  You may terminate your account at any time by using the
                  account deletion feature in your settings or by contacting our
                  support team.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  By Us
                </h4>
                <p className="text-gray-600">
                  We may suspend or terminate your account if you violate these
                  terms, engage in prohibited activities, or for other reasons
                  at our discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Changes to Terms
              </h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                We may update these Terms and Conditions from time to time. When
                we make changes, we will:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>
                  • Update the Last updated&quot; date at the top of this page
                </li>
                <li>
                  • Notify users of significant changes via email or platform
                  notification
                </li>
                <li>
                  • Provide a reasonable notice period before changes take
                  effect
                </li>
                <li>
                  • Allow users to review changes before they become binding
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                Continued use of our services after changes take effect
                constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Information
            </h3>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms and Conditions, please
              contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong> legal@iterbene.com
              </p>
              <p>
                <strong>Address:</strong> Iterbene Legal Department, [Your
                Company Address]
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Governing Law:</strong> These terms are governed by the
                laws of [Your Jurisdiction]. Any disputes will be resolved in
                the courts of [Your Jurisdiction].
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
