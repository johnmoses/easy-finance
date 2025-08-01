# EasyFinance Mobile App

A comprehensive financial management mobile application built with React Native 0.80.0, featuring blockchain integration, AI chat support, and modern financial tools.

## Features

### 🏠 **Dashboard (Home)**
- Real-time balance overview
- Quick action cards for transactions, investments, and goals
- Financial summary with key metrics
- Quick access to core features

### 🔐 **Authentication**
- Secure login and registration
- JWT token-based authentication
- Form validation and error handling
- Seamless navigation flow

### 💰 **Finance Management**
- Transaction tracking (income/expense)
- Category-based organization
- Add new transactions with modal interface
- Real-time balance calculations
- Transaction history with filtering

### 📈 **Wealth Management**
- Investment portfolio overview
- Real-time stock/crypto tracking
- Performance metrics and analytics
- Portfolio diversification insights
- Gain/loss calculations

### 🎯 **Financial Planning**
- Goal setting and tracking
- Progress visualization with progress bars
- Deadline management
- Category-based goal organization
- Achievement milestones

### ⛓️ **Blockchain Integration**
- Live blockchain visualization
- Block mining simulation
- Transaction validation
- Hash verification
- Nonce and timestamp tracking

### 🤖 **AI Chat Assistant**
- Intelligent financial queries
- Real-time chat interface
- Context-aware responses
- Financial advice and insights
- Natural language processing

## Tech Stack

- **React Native**: 0.80.0
- **React Navigation**: 7.x (Stack & Bottom Tabs)
- **TypeScript**: Full type safety
- **Axios**: API communication
- **Context API**: State management
- **React Hooks**: Modern React patterns

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # Global state management
├── navigation/         # Navigation configuration
├── screens/           # Main app screens
├── services/          # API services
└── types/            # TypeScript definitions
```

## Installation

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **iOS Setup**:
```bash
cd ios && pod install && cd ..
```

3. **Run the app**:
```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android
```

## API Integration

The app connects to the Flask API backend at `http://localhost:5000/api` with the following endpoints:

- **Auth**: `/auth/login`, `/auth/register`, `/auth/logout`
- **Finance**: `/finance/transactions`, `/finance/accounts`
- **Wealth**: `/wealth/portfolio`, `/wealth/investments`
- **Planning**: `/planning/goals`
- **Blockchain**: `/blockchain/chain`, `/blockchain/mine`
- **Chat**: `/chat/message`, `/chat/history`

## Key Components

### Navigation
- **Stack Navigator**: Auth flow management
- **Bottom Tab Navigator**: Main app navigation
- **Screen transitions**: Smooth navigation experience

### State Management
- **AppContext**: Global state with useReducer
- **Custom Hooks**: useAuth, useFinance, useWealth, usePlanning
- **Type Safety**: Full TypeScript integration

### UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: System theme detection
- **Loading States**: User feedback during API calls
- **Error Handling**: Graceful error management
- **Form Validation**: Input validation and feedback

## Development

### Adding New Features
1. Create screen in `src/screens/`
2. Add navigation route in `AppNavigator.tsx`
3. Create API service in `src/services/api.ts`
4. Add types in `src/types/index.ts`
5. Update context if needed

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Consistent naming**: camelCase for variables, PascalCase for components

## Testing

```bash
# Run tests
npm test
# or
yarn test

# Run with coverage
npm run test:coverage
```

## Build & Deploy

### Development Build
```bash
# iOS
npx react-native run-ios --configuration Debug

# Android
npx react-native run-android --variant debug
```

### Production Build
```bash
# iOS
npx react-native run-ios --configuration Release

# Android
npx react-native run-android --variant release
```

## Performance Optimization

- **Lazy Loading**: Screen-based code splitting
- **Image Optimization**: Proper image handling
- **Memory Management**: Efficient state updates
- **API Caching**: Reduced network calls
- **Bundle Size**: Optimized dependencies

## Security Features

- **JWT Authentication**: Secure token management
- **API Security**: Request/response validation
- **Data Encryption**: Sensitive data protection
- **Secure Storage**: Local data security

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.