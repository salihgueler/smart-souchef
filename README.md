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
- AWS Account configured on the device.

### Installation
1. Clone the repository
```bash
git clone
cd smart-sous-chef
```

2. Install dependencies
```bash
npm install
```

### Workshop Steps
1. Check out the starting branch:
```bash
git checkout starter
```

2. Follow along with the workshop, switching branches as needed to see the progression:
```bash
git checkout auth
# etc.
```

The flow is as follows:

1. starter
2. auth
3. storage
4. ai
5. data
6. main

## Technologies Used
- AWS Amplify
- Expo (A React Native framework)
- TypeScript

## License
MIT-0
