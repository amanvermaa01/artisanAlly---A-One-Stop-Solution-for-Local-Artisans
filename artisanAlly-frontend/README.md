# ArtisanAlly Frontend

A modern, AI-powered marketplace frontend for local artisans built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Complete user registration and login system
- **Product Management**: Browse, search, and manage artisan products
- **Social Features**: Posts, comments, likes, and community interaction
- **Shopping Cart**: Full e-commerce functionality with Stripe integration
- **AI Tools**: AI-powered features for trends, descriptions, and search
- **Dashboard**: Comprehensive dashboard for artisans and customers
- **State Management**: Zustand for efficient state management
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **UI Components**: Headless UI

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd artisanAlly-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend API

Make sure the backend server is running on `http://localhost:5000` with the following endpoints:

- Authentication: `/api/auth/*`
- Users: `/api/user/*`
- Products: `/api/products/*`
- Posts: `/api/posts/*`
- Cart: `/api/cart/*`
- Checkout: `/api/checkout/*`
- AI Tools: `/api/ai/*`

## 📱 Pages & Features

### Public Pages

- **Home**: Landing page with featured products and stories
- **Products**: Product catalog with search and filtering
- **Posts**: Community posts and artisan stories
- **Login/Register**: Authentication pages

### Protected Pages

- **Dashboard**: User dashboard with analytics
- **Profile**: User profile management
- **Cart**: Shopping cart and checkout
- **AI Tools**: AI-powered marketing tools

## 🎨 Design System

### Colors

- **Primary**: Blue (#0284c7)
- **Secondary**: Purple (#c026d3)
- **Accent**: Orange (#ea580c)

### Components

- **Cards**: Product and post cards with hover effects
- **Buttons**: Primary, secondary, and outline variants
- **Forms**: Consistent input styling with validation
- **Navigation**: Responsive header with mobile menu

## 🔌 API Integration

The frontend integrates with the backend API through:

- **Auth Store**: User authentication and profile management
- **Product Store**: Product CRUD operations
- **Post Store**: Social features and content management
- **Cart Store**: Shopping cart functionality
- **AI Store**: AI-powered features and tools

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server to serve the SPA

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@artisanally.com or create an issue in the repository.

---

Built with ❤️ for artisans worldwide
