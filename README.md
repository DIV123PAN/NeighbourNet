# NeighborNet - Neighborhood Service Request Platform

## Overview

NeighborNet is a comprehensive full-stack application that connects neighbors for local help and service requests. Built with React, TypeScript, and Tailwind CSS, it features an intelligent matching algorithm, real-time data processing, and a beautiful, responsive design.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Service Request Management**: Create, view, and respond to service requests
- **Intelligent Matching Algorithm**: Advanced algorithm matching users based on skills, proximity, availability, and ratings
- **Real-time Filtering**: Advanced search and filtering capabilities
- **Dashboard Analytics**: Comprehensive neighborhood activity insights
- **Response System**: Users can respond to requests with proposals

### Technical Features
- **Data Persistence**: Local storage-based data management
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first design that works on all devices
- **Component Architecture**: Modular, reusable components
- **Edge Case Handling**: Robust handling of no matches, unavailable users, etc.

## Matching Algorithm

The NeighborNet matching algorithm is the core of the platform, using a weighted scoring system:

### Algorithm Weights
- **Skills Match (40%)**: Exact and fuzzy matching of user skills with request needs
- **Proximity Match (30%)**: Geographic distance between user and request location
- **Availability Match (20%)**: User availability alignment with request timing
- **User Rating (10%)**: Historical performance and reliability score

### Scoring Formula
```
Total Score = (Skills × 0.4) + (Proximity × 0.3) + (Availability × 0.2) + (Rating × 0.1)
```

### Edge Cases Handled
1. **No Skill Matches**: Implements fuzzy matching for related skills
2. **No Availability**: Suggests closest available time slots
3. **No Proximity**: Expands search radius gradually
4. **Low-rated Users**: Weighted down but not excluded to maintain fairness
5. **No Matches**: Provides fallback recommendations

### Algorithm Implementation Details

#### Skills Matching
- Exact skill matching gets full score (1.0)
- Fuzzy matching (partial text matches) gets 50% score
- Categories with related skills are prioritized

#### Proximity Calculation
- Neighborhood-based proximity mapping
- Same neighborhood: 100% score
- Adjacent neighborhoods: 70-90% score
- Distant neighborhoods: 10-40% score

#### Availability Matching
- Day-of-week matching
- Time slot alignment
- Flexible scheduling considerations

#### Rating Integration
- Normalized user ratings (0-5 scale)
- Historical performance weighting
- New user handling with default scores

## Data Processing Pipeline

### 1. Data Collection
- User registration and profile data
- Service request creation and updates
- User interaction tracking
- Response and completion data

### 2. Data Processing
- Real-time match generation
- Neighborhood activity aggregation
- Category and urgency analysis
- Performance metrics calculation

### 3. Data Analytics
- Request completion rates
- Average response times
- Neighborhood activity patterns
- User engagement metrics

### 4. Data Visualization
- Interactive dashboard charts
- Real-time statistics
- Trend analysis
- Performance indicators

## Project Structure

```
src/
├── components/           # React components
│   ├── AuthForm.tsx     # Authentication forms
│   ├── Dashboard.tsx    # Analytics dashboard
│   ├── FilterPanel.tsx  # Search and filtering
│   ├── Header.tsx       # Navigation header
│   ├── RequestCard.tsx  # Service request display
│   └── ServiceRequestForm.tsx # Request creation
├── types/               # TypeScript definitions
│   └── index.ts        # Core type definitions
├── utils/               # Utility functions
│   ├── matchingAlgorithm.ts # Core matching logic
│   ├── mockData.ts      # Sample data
│   └── storage.ts       # Data persistence
└── App.tsx             # Main application
```

## Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd neighbornet
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## Usage

### Getting Started
1. **Register**: Create an account with your skills and availability
2. **Browse Requests**: View service requests in your area
3. **Create Requests**: Post your own service needs
4. **Match & Respond**: Get matched with suitable helpers
5. **Complete Services**: Mark requests as completed

### Sample User Accounts
- **Email**: john.doe@email.com, **Password**: password123
- **Email**: sarah.wilson@email.com, **Password**: password123
- **Email**: mike.brown@email.com, **Password**: password123

### Creating Service Requests
1. Click "Create Request" in the header
2. Fill in service details (title, description, category)
3. Set urgency level and estimated duration
4. Choose compensation type (free, paid, or trade)
5. Set deadline and location
6. Select required skills
7. Submit to get instant matches

### Filtering & Search
- **Text Search**: Search titles and descriptions
- **Category Filter**: Filter by service type
- **Neighborhood**: Limit to specific areas
- **Urgency**: Filter by priority level
- **Compensation**: Filter by payment type
- **Status**: Filter by request status

## Architecture Decisions

### Data Storage
- **Local Storage**: Used for demo purposes, easily replaceable with MongoDB
- **JSON Structure**: Mimics NoSQL document structure
- **Data Persistence**: Automatic saving on state changes

### Component Design
- **Modular Architecture**: Each component has single responsibility
- **Props Interface**: Well-defined TypeScript interfaces
- **State Management**: Centralized state with local storage sync

### Matching Algorithm
- **Real-time Processing**: Matches generated on request creation
- **Weighted Scoring**: Balanced approach to different factors
- **Scalable Design**: Easily extensible for additional factors

## Future Enhancements

### Database Integration
- MongoDB connection for production use
- User authentication with JWT tokens
- Real-time updates with WebSockets

### Advanced Features
- **Geolocation**: GPS-based proximity matching
- **Payment Integration**: Secure payment processing
- **Rating System**: Bidirectional user ratings
- **Messaging**: In-app communication
- **Push Notifications**: Real-time alerts

### Mobile App
- React Native mobile application
- Push notifications
- Offline functionality
- Camera integration for request photos

## Testing

The application includes comprehensive error handling and edge case management:

- **Authentication**: Invalid credentials, duplicate emails
- **Requests**: Missing required fields, invalid dates
- **Matching**: No available matches, skill mismatches
- **Filtering**: Empty result sets, invalid filter combinations
- **Data**: Storage failures, corrupted data recovery

## Performance Considerations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Virtual Scrolling**: Efficient rendering of large lists
- **Bundle Splitting**: Optimized JavaScript bundles

## Security Measures

- **Input Validation**: All user inputs sanitized
- **XSS Prevention**: HTML escaping and content security
- **Data Privacy**: User data protection measures
- **Authentication**: Secure password handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

## License

This project is licensed under the MIT License.

---

**NeighborNet** - Bringing communities together through technology!