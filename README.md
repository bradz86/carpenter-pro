# Carpenter Pro 🔨

A comprehensive mobile app for carpenters and contractors featuring advanced calculators, live material pricing, and project estimation tools.

## Features

### 📐 Advanced Calculators
- Board Feet Calculator with wood species pricing
- Concrete Calculator (slabs, footings, columns)
- Framing Calculator (studs, plates, headers)
- Drywall Calculator
- Roofing Calculator
- Stair Calculator
- Deck Calculator
- Insulation Calculator

### 💰 Smart Project Estimator
- Quick material + labor calculations
- Save and reuse templates
- Professional quote generation
- PDF export capability

### 📊 Live Material Pricing
- Automated monthly price updates from major retailers
- Database of 50+ common materials
- Custom price overrides
- Price history tracking
- Real-time price comparison
- Works offline with cached data

### 🔧 Additional Features
- Offline-first architecture
- Material database management
- Settings customization
- Cross-platform (iOS & Android)

## Tech Stack

### Frontend
- React Native with Expo
- React Navigation
- React Native Paper (Material Design)
- Expo SQLite
- AsyncStorage

### Backend
- Node.js/Express
- PostgreSQL
- DigitalOcean App Platform
- Automated price scraping with Bright Data

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI
- Expo Go app on your phone

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bradz86/carpenter-pro.git
cd carpenter-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Scan the QR code with Expo Go app

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the server:
```bash
npm run dev
```

## Project Structure

```
carpenter-pro/
├── App.js                 # Main app entry point
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── utils/           # Utilities and calculations
│   ├── services/        # API services
│   └── styles/          # Theme and styles
├── backend/             # Node.js API
│   ├── server.js       # Express server
│   ├── src/
│   │   └── services/   # Price scraping service
│   └── migrations/     # Database migrations
└── .taskmaster/        # Project management
```

## Deployment

### Frontend (Expo)
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Backend (DigitalOcean)
The backend is configured for deployment on DigitalOcean App Platform. See the deployment guide in the docs folder.

## License

This project is licensed under the MIT License - see the LICENSE file for details.