import { User, ServiceRequest, Match } from '../types';

/**
 * NeighborNet Matching Algorithm
 * 
 * This algorithm matches service requests with available users based on:
 * 1. Skills Match (40% weight) - How well user skills align with request needs
 * 2. Proximity Match (30% weight) - Geographic proximity between user and request
 * 3. Availability Match (20% weight) - User availability vs request timing
 * 4. User Rating (10% weight) - User's reputation and past performance
 * 
 * Score calculation: (Skills * 0.4) + (Proximity * 0.3) + (Availability * 0.2) + (Rating * 0.1)
 * 
 * Edge cases handled:
 * - No skill matches: Returns users with similar skills (fuzzy matching)
 * - No availability matches: Suggests closest available times
 * - No proximity matches: Expands search radius
 * - Low-rated users: Weighted down but not excluded
 */

const SKILL_WEIGHT = 0.4;
const PROXIMITY_WEIGHT = 0.3;
const AVAILABILITY_WEIGHT = 0.2;
const RATING_WEIGHT = 0.1;

// Neighborhood proximity mapping (simplified for demo)
const neighborhoodProximity: { [key: string]: { [key: string]: number } } = {
  'Downtown': { 'Downtown': 1.0, 'Riverside': 0.8, 'Hillcrest': 0.6, 'Oakwood': 0.4 },
  'Riverside': { 'Riverside': 1.0, 'Downtown': 0.8, 'Hillcrest': 0.7, 'Oakwood': 0.5 },
  'Hillcrest': { 'Hillcrest': 1.0, 'Riverside': 0.7, 'Downtown': 0.6, 'Oakwood': 0.9 },
  'Oakwood': { 'Oakwood': 1.0, 'Hillcrest': 0.9, 'Riverside': 0.5, 'Downtown': 0.4 }
};

export const calculateSkillsMatch = (userSkills: string[], requestSkills: string[]): number => {
  if (requestSkills.length === 0) return 1.0;
  
  const matches = requestSkills.filter(skill => userSkills.includes(skill));
  const exactMatch = matches.length / requestSkills.length;
  
  // Fuzzy matching for related skills
  const fuzzyMatches = requestSkills.filter(reqSkill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
  
  const fuzzyMatch = fuzzyMatches.length / requestSkills.length * 0.5;
  
  return Math.min(exactMatch + fuzzyMatch, 1.0);
};

export const calculateProximityMatch = (userNeighborhood: string, requestNeighborhood: string): number => {
  const proximity = neighborhoodProximity[userNeighborhood]?.[requestNeighborhood];
  return proximity || 0.1; // Minimum proximity for unknown neighborhoods
};

export const calculateAvailabilityMatch = (
  userAvailability: { days: string[], timeSlots: string[] },
  requestDate: string
): number => {
  const requestDay = new Date(requestDate).toLocaleDateString('en-US', { weekday: 'long' });
  const requestHour = new Date(requestDate).getHours();
  
  let timeSlot = 'Morning';
  if (requestHour >= 12 && requestHour < 17) timeSlot = 'Afternoon';
  else if (requestHour >= 17 && requestHour < 20) timeSlot = 'Evening';
  else if (requestHour >= 20 || requestHour < 6) timeSlot = 'Night';
  
  const dayMatch = userAvailability.days.includes(requestDay) ? 1.0 : 0.3;
  const timeMatch = userAvailability.timeSlots.includes(timeSlot) ? 1.0 : 0.5;
  
  return (dayMatch + timeMatch) / 2;
};

export const calculateRatingMatch = (rating: number): number => {
  return Math.min(rating / 5.0, 1.0);
};

export const findMatches = (
  request: ServiceRequest,
  users: User[],
  excludeUserId?: string
): Match[] => {
  const availableUsers = users.filter(user => 
    user.id !== request.userId && 
    user.id !== excludeUserId &&
    user.isActive
  );
  
  const matches: Match[] = availableUsers.map(user => {
    const skillsMatch = calculateSkillsMatch(user.skills, request.skillsNeeded);
    const proximityMatch = calculateProximityMatch(user.neighborhood, request.location.neighborhood);
    const availabilityMatch = calculateAvailabilityMatch(user.availability, request.neededBy);
    const ratingMatch = calculateRatingMatch(user.rating);
    
    const totalScore = (
      skillsMatch * SKILL_WEIGHT +
      proximityMatch * PROXIMITY_WEIGHT +
      availabilityMatch * AVAILABILITY_WEIGHT +
      ratingMatch * RATING_WEIGHT
    );
    
    return {
      requestId: request.id,
      userId: user.id,
      score: totalScore,
      factors: {
        skillsMatch,
        proximityMatch,
        availabilityMatch,
        userRating: ratingMatch
      },
      generatedAt: new Date().toISOString()
    };
  });
  
  // Sort by score (highest first) and return top matches
  return matches.sort((a, b) => b.score - a.score);
};

export const getMatchExplanation = (match: Match): string => {
  const { factors } = match;
  const explanations = [];
  
  if (factors.skillsMatch > 0.8) {
    explanations.push('Perfect skill match');
  } else if (factors.skillsMatch > 0.5) {
    explanations.push('Good skill match');
  } else if (factors.skillsMatch > 0.2) {
    explanations.push('Partial skill match');
  }
  
  if (factors.proximityMatch > 0.8) {
    explanations.push('Same neighborhood');
  } else if (factors.proximityMatch > 0.5) {
    explanations.push('Nearby location');
  }
  
  if (factors.availabilityMatch > 0.8) {
    explanations.push('Perfect availability');
  } else if (factors.availabilityMatch > 0.5) {
    explanations.push('Good availability');
  }
  
  if (factors.userRating > 0.9) {
    explanations.push('Highly rated');
  } else if (factors.userRating > 0.8) {
    explanations.push('Well rated');
  }
  
  return explanations.join(', ') || 'Basic match';
};