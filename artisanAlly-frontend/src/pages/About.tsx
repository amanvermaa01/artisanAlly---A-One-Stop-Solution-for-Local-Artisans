import React from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  GlobeAltIcon,
  UsersIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const teamMembers = [
    {
      name: "Aman Verma",
      role: "Founder & CEO",
      description: "Passionate about bridging traditional craftsmanship with modern technology.",
      image: "👨‍💻",
      email: "amanverma.cse@sandipuniversity.edu.in"
    },
    {
      name: "AI Development Team",
      role: "Technology Partners",
      description: "Dedicated AI specialists focused on empowering artisans with intelligent tools.",
      image: "🤖",
      email: ""
    },
    {
      name: "Artisan Community",
      role: "Creative Partners",
      description: "Talented craftspeople from around the world sharing their stories and skills.",
      image: "🎨",
      email: ""
    }
  ];

  const values = [
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Passion for Craft",
      description: "We believe every handmade creation tells a unique story worth sharing with the world."
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: "Global Connectivity",
      description: "Connecting local artisans with global audiences through innovative technology."
    },
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: "Innovation & Tradition",
      description: "Harmoniously blending traditional craftsmanship with cutting-edge AI technology."
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Community First",
      description: "Building a supportive community where artisans can learn, grow, and succeed together."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Trust & Quality",
      description: "Maintaining the highest standards of quality and authenticity in every interaction."
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: "AI-Powered Growth",
      description: "Leveraging artificial intelligence to help artisans reach their full potential."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "ArtisanAlly Founded",
      description: "Started with a vision to empower local artisans through AI technology"
    },
    {
      year: "2024",
      title: "AI Tools Launch",
      description: "Introduced AI-powered marketing and content generation tools"
    },
    {
      year: "2024",
      title: "Community Growth",
      description: "Building a thriving marketplace for authentic handcrafted products"
    },
    {
      year: "Future",
      title: "Global Expansion",
      description: "Planning to connect artisans worldwide and expand our AI capabilities"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  About
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    ArtisanAlly.
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                  We're on a mission to empower local artisans by connecting traditional craftsmanship 
                  with modern AI technology, creating opportunities for authentic creators worldwide.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Explore Products
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Join Our Community
                </Link>
              </div>
            </div>
            
            {/* Right Illustration */}
            <div className="relative">
              <div className="relative z-10">
                <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-blue-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  {/* Mission illustration */}
                  <div className="text-8xl">🌟</div>
                  <div className="absolute top-4 right-4 text-4xl">🎯</div>
                  <div className="absolute top-4 left-4 w-16 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">💝</div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-3xl">🚀</div>
                  <div className="absolute bottom-4 right-4 text-3xl">🌍</div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-200 rounded-2xl transform rotate-12 opacity-80"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-200 rounded-full opacity-80"></div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-green-200 rounded-xl transform rotate-45 opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div className="space-y-6">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To bridge the gap between traditional craftsmanship and modern technology, 
                empowering artisans with AI-driven tools that help them tell their stories, 
                reach global audiences, and build sustainable businesses around their passion.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Preserve traditional craftsmanship</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Empower artisans with AI technology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Connect creators with global markets</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a world where every artisan has the tools and platform needed to 
                share their unique craft with the world, where traditional skills are valued 
                and preserved, and where AI serves as a bridge rather than a replacement for human creativity.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Global artisan community platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">AI-human collaboration in creativity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Sustainable craft economy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The principles that guide everything we do at ArtisanAlly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                  <div className="text-gray-700">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Key milestones in our mission to empower artisans
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-24 h-16 bg-gradient-to-br from-orange-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{milestone.year}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The passionate people behind ArtisanAlly's mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center text-4xl">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {member.description}
                </p>
                {member.email && (
                  <p className="text-sm text-gray-500">
                    {member.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <HeartIcon className="h-10 w-10 text-gray-700" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                Ready to Join Our Mission?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Whether you're an artisan looking to showcase your craft or someone who appreciates 
                handmade quality, we'd love to have you as part of our community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started Today
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
