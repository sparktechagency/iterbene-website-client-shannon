import React from "react";
import { MapPin, Users, Camera, Heart, Globe, Star } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect. Share. Explore.
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Iterbene is where travel stories come alive, connecting wanderers
            from around the globe through shared experiences, stunning
            photography, and inspiring adventures.
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-4">
                <Camera className="h-12 w-12 text-blue-600" />
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Your Journey Matters
                  </h3>
                  <p className="text-gray-600">
                    Every trip has a story worth sharing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2024, Iterbene was born from a simple belief: travel
                experiences are meant to be shared. Our founders, passionate
                travelers themselves, recognized the need for a platform that
                goes beyond basic photo sharing to create meaningful connections
                between explorers worldwide.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                From backpackers discovering hidden gems to luxury travelers
                sharing five-star experiences, Iterbene celebrates every type of
                journey. We believe that whether you&apos;re exploring your local
                neighborhood or trekking through remote mountains, your story
                deserves to be heard.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Built with Passion
                  </h4>
                  <p className="text-gray-600">By travelers, for travelers</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6">Why Iterbene?</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Authentic Experiences</p>
                    <p className="text-blue-100 text-sm">
                      Real stories from real travelers
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Global Community</p>
                    <p className="text-blue-100 text-sm">
                      Connect with fellow adventurers
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Discover New Places</p>
                    <p className="text-blue-100 text-sm">
                      Find your next adventure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To create a vibrant global community where travelers can share
                their adventures, inspire others, and discover new destinations
                through authentic, personal experiences. We&apos;re committed to
                making travel more accessible, meaningful, and connected.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the world&apos;s leading platform for travel storytelling,
                where every journey becomes a source of inspiration and
                connection. We envision a world where cultural exchange through
                travel stories promotes understanding, empathy, and global
                friendship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Inclusivity
              </h4>
              <p className="text-gray-600">
                We celebrate diverse travel experiences and welcome explorers
                from all backgrounds, budgets, and travel styles.
              </p>
            </div>
            <div className="p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Authenticity
              </h4>
              <p className="text-gray-600">
                We prioritize genuine experiences and honest storytelling over
                polished perfection, celebrating real moments and emotions.
              </p>
            </div>
            <div className="p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Community
              </h4>
              <p className="text-gray-600">
                We foster meaningful connections between travelers, creating
                lasting friendships and support networks across the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-6">Join Our Journey</h3>
          <p className="text-xl mb-8 opacity-90">
            Ready to share your travel stories and connect with fellow
            adventurers?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
