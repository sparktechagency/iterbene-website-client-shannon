# 🌍 Iterbene - Travel Social Media Platform

**Iterbene** is a comprehensive travel-focused social media platform that connects travelers, enables journey sharing, and helps users discover new destinations through an interactive community-driven experience.

## 🚀 Features Overview

### 🎯 Core Social Features
- **Travel Posts & Stories** - Share travel experiences through photos, videos, and journey stories
- **Real-time Messaging** - Connect with fellow travelers through instant messaging
- **Friend Connections** - Send/receive friend requests and build travel networks
- **Groups & Events** - Create or join travel groups and organize events
- **Real-time Notifications** - Stay updated with likes, comments, messages, and friend activities

### 🗺️ Travel-Specific Features
- **Interactive Journey Creation** - Create detailed travel itineraries with timeline and locations
- **Google Maps Integration** - View friend's visited locations and discover interested destinations
- **Location-based Discovery** - Find travelers and posts based on geographic locations
- **Itinerary PDF Export** - Download travel plans as professional PDF documents
- **Hashtag System** - Organize and discover content through travel-related hashtags

### 📱 Content Management
- **Multi-media Support** - Upload images, videos, and documents with preview functionality
- **Post Reactions** - Like, comment, and react to travel content
- **Nested Replies** - Engage in detailed discussions with threaded comments
- **Story-like Journey Feed** - Share temporary travel updates similar to Instagram stories
- **Watch Video Section** - Dedicated space for travel video content

### 🎨 User Experience
- **Mobile-First Design** - Optimized for mobile devices with responsive layouts
- **WhatsApp-style Messaging** - Familiar messaging interface with file sharing
- **Instagram-like Media Player** - Professional video player with custom controls
- **Real-time Updates** - Live notifications and messaging without page refresh

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: 
  - Lucide React (Icons)
  - Framer Motion (Animations)
  - Custom component library
- **Media Handling**: 
  - Next.js Image optimization
  - Custom video player with controls
  - PDF preview and generation

### Backend Integration
- **API**: RESTful API with Redux RTK Query
- **Real-time**: WebSocket integration for live updates
- **File Upload**: Multi-format file handling (images, videos, PDFs, documents)
- **Authentication**: JWT-based user authentication
- **Notifications**: Real-time notification system

### Maps & Location
- **Google Maps API**: Location services and map visualization
- **Geolocation**: Browser-based location detection
- **Location Search**: Place search and autocomplete functionality

## 📂 Project Structure

```
inter-bene-website-client/
├── src/
│   ├── components/
│   │   ├── common/                    # Reusable components
│   │   │   ├── mobile-bottom-navigation.tsx
│   │   │   ├── EnhancedNotificationsDropdown.tsx
│   │   │   └── EnhancedMessagesDropdown.tsx
│   │   ├── pages/                     # Page-specific components
│   │   │   ├── message-inbox/         # Messaging system
│   │   │   ├── notifications/         # Notification management
│   │   │   ├── UserProfilePage/       # User profiles & content
│   │   │   └── home/                  # Feed and home components
│   │   └── ui/                        # UI components
│   ├── redux/
│   │   ├── features/
│   │   │   ├── api/                   # API configurations
│   │   │   ├── post/                  # Post management
│   │   │   ├── inbox/                 # Messaging APIs
│   │   │   └── notifications/         # Notification APIs
│   │   └── store.ts                   # Redux store configuration
│   ├── types/                         # TypeScript type definitions
│   ├── hooks/                         # Custom React hooks
│   ├── utils/                         # Utility functions
│   └── styles/                        # Global styles and themes
├── public/                            # Static assets
└── README.md                          # Project documentation
```

## 🎮 Key Features Deep Dive

### 📝 Journey Creation System
- **Timeline Builder**: Create step-by-step travel itineraries
- **Location Integration**: Add destinations with Google Maps
- **Media Attachments**: Include photos and videos for each stop
- **Collaborative Planning**: Share and edit itineraries with friends
- **PDF Export**: Generate professional travel documents

### 💬 Advanced Messaging
- **File Sharing**: Send images, videos, PDFs, and documents
- **Preview System**: WhatsApp-style file previews before sending
- **Video Calls**: Integrated video calling for travel planning
- **Group Chats**: Organize travel groups with multi-user messaging
- **Message Reactions**: React to messages with emojis

### 🗺️ Map Integration Features
- **Friend Location Tracking**: See where friends have traveled
- **Interest-based Recommendations**: Discover places based on preferences
- **Location Posts**: Share content from specific geographic locations
- **Route Visualization**: Display travel routes on interactive maps
- **Place Discovery**: Find hidden gems through community posts

### 📱 Mobile Experience
- **Bottom Navigation**: Easy access to key features
- **Touch Optimized**: Gesture-based navigation and interactions
- **Offline Capability**: Cache content for offline viewing
- **Push Notifications**: Real-time alerts on mobile devices
- **Progressive Web App**: Installable web app experience

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sparktechagency/inter-bene-website-client.git
cd inter-bene-website-client
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_WEBSOCKET_URL=your_websocket_url
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Journey
1. Navigate to the Journey section
2. Click "Create New Journey"
3. Add destinations, photos, and timeline
4. Share with friends or keep private
5. Export as PDF for travel reference

### Connecting with Travelers
1. Use the search function to find users
2. Send friend requests to connect
3. View their travel locations on the map
4. Join groups based on destinations
5. Plan trips together through messaging

### Sharing Travel Content
1. Create posts with photos/videos
2. Add location tags and hashtags
3. Share temporary journey updates
4. Engage with community through reactions
5. Build your travel profile and followers

## 🤝 Contributing

We welcome contributions from the travel and developer community!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure code quality
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Ensure mobile responsiveness

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic social media features
- ✅ Messaging system with file sharing
- ✅ Journey creation and sharing
- ✅ Google Maps integration
- ✅ Mobile-responsive design

### Phase 2 (Upcoming)
- 🚧 AI-powered travel recommendations
- 🚧 Advanced itinerary collaboration
- 🚧 Integration with booking platforms
- 🚧 Augmented reality features
- 🚧 Multi-language support

### Phase 3 (Future)
- 📋 Marketplace for travel services
- 📋 Travel expense tracking
- 📋 Weather integration
- 📋 Currency converter
- 📋 Travel insurance integration

## 🛡️ Security & Privacy

- **Data Protection**: User data encrypted and securely stored
- **Privacy Controls**: Granular privacy settings for posts and profiles
- **Content Moderation**: AI-powered content filtering
- **Secure Authentication**: JWT-based secure login system
- **GDPR Compliance**: Full compliance with data protection regulations

## 📊 Performance

- **Optimized Loading**: Lazy loading for images and components
- **Caching Strategy**: Intelligent caching for better performance
- **CDN Integration**: Fast content delivery globally
- **Mobile Performance**: Optimized for low-bandwidth connections
- **SEO Optimized**: Server-side rendering for better search visibility

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React/Next.js specialists
- **Backend Development**: Node.js and database experts
- **UI/UX Design**: Travel-focused user experience designers
- **Product Management**: Travel industry professionals
- **QA Testing**: Mobile and web testing specialists

## 📞 Support

- **Documentation**: [docs.iterbene.com](https://docs.iterbene.com)
- **Community**: [discord.gg/iterbene](https://discord.gg/iterbene)
- **Email Support**: support@iterbene.com
- **Bug Reports**: [GitHub Issues](https://github.com/your-repo/issues)

## 🌟 Acknowledgments

- **Travel Community**: Inspiration from global travelers
- **Open Source Libraries**: Thanks to all contributors
- **Design Inspiration**: WhatsApp, Instagram, and modern travel apps
- **Map Services**: Google Maps Platform
- **Testing Community**: Beta testers and early adopters

---

**Made with ❤️ for the travel community**

*Discover. Connect. Explore. Share your journey with Iterbene.*