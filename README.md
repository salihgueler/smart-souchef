# Smart Sous Chef Workshop

## Overview
This project serves as a companion for a workshop that demonstrates the progression from a basic mocked application to a fully functional Smart Sous Chef app. Each step of development is captured in different branches, allowing participants to follow along and understand the evolution of the application.

## Project Structure
```
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation components
│   └── components/        # Reusable UI components
├── amplify/               # AWS Amplify configuration
│   ├── auth/              # Authentication settings
│   ├── data/              # Data models and schema
│   └── storage/           # Storage configuration
├── data/                  # Data layer
│   ├── repositories/      # Repository pattern implementation
│   └── types/             # TypeScript type definitions
├── ios/                   # iOS native code
└── android/              # Android native code
```

## Features
- Tab-based navigation
- Meal management system
- Shopping list functionality
- User authentication
- Cloud storage integration
- Favorite meals tracking

## Workshop Progression
The workshop is structured in branches, each representing a different stage of development:

1. `starter` - Basic mocked application
2. `auth` - Adding authentication
3. `storage` - Adding cloud storage
4. `ai` - Adding AI capabilities
5. `data` - Implementing the data layer
6. `main` - Final production-ready application

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo development environment (for React Native)
  - iOS toolchain for testing on iOS
  - Android toolchain for testin on Android
- AWS Account (for AWS)

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd smart-sous-chef
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

### Workshop Steps
1. Check out the starting branch:
```bash
git checkout starter
```

2. Follow along with the workshop, switching branches as needed to see the progression:
```bash
git checkout auth
git checkout data-layer
# etc.
```

## Technologies Used
- React Native
- Expo
- AWS Amplify
- TypeScript

## Contributing
This project is designed for workshop purposes. If you find any issues or have suggestions for improvements, please open an issue in the repository.

## License
MIT
