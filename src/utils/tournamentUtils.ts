export interface Team {
  id: string;
  name: string;
  logo?: string;
  createdAt: string;
  registrationOrder: number;
  points: number; // Added points property to fix TypeScript errors
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  team1Goals: number;
  team2Goals: number;
  round: number;
  matchNumber: number;
  played: boolean;
  winner?: Team;
  loser?: Team;
}

export interface Championship {
  id: string;
  name: string;
  createdAt: string;
  teams: Team[];
  matches: Match[];
  winner?: Team;
  runnerUp?: Team;
  thirdPlace?: Team;
  fourthPlace?: Team;
  completed: boolean;
}

// Function to generate a random number between min and max (inclusive)
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate team points for tiebreaker
export const calculateTeamPoints = (team: Team, matches: Match[]): number => {
  let points = 0;
  
  matches.forEach(match => {
    if (match.played) {
      if (match.team1.id === team.id) {
        points += match.team1Goals; // Points for goals scored
        points -= match.team2Goals; // Points deducted for goals conceded
      } else if (match.team2.id === team.id) {
        points += match.team2Goals; // Points for goals scored
        points -= match.team1Goals; // Points deducted for goals conceded
      }
    }
  });
  
  return points;
};

// Determine winner of match, handling tiebreakers
export const determineWinner = (match: Match, allMatches: Match[]): { winner: Team; loser: Team } => {
  if (match.team1Goals > match.team2Goals) {
    return { winner: match.team1, loser: match.team2 };
  } else if (match.team2Goals > match.team1Goals) {
    return { winner: match.team2, loser: match.team1 };
  } else {
    // Tiebreaker 1: Team with most net points
    const team1Points = calculateTeamPoints(match.team1, allMatches);
    const team2Points = calculateTeamPoints(match.team2, allMatches);
    
    if (team1Points > team2Points) {
      return { winner: match.team1, loser: match.team2 };
    } else if (team2Points > team1Points) {
      return { winner: match.team2, loser: match.team1 };
    } else {
      // Tiebreaker 2: Team registered first
      if (match.team1.registrationOrder < match.team2.registrationOrder) {
        return { winner: match.team1, loser: match.team2 };
      } else {
        return { winner: match.team2, loser: match.team1 };
      }
    }
  }
};

// Create initial championship structure with teams
export const createChampionship = (name: string, teams: Team[]): Championship => {
  // Ensure we have exactly 8 teams
  if (teams.length !== 8) {
    throw new Error("Championship must have exactly 8 teams");
  }
  
  // Shuffle teams to randomize matchups and initialize points
  const shuffledTeams = [...teams].map(team => ({
    ...team,
    points: 0 // Initialize points for each team
  })).sort(() => Math.random() - 0.5);
  
  // Create quarterfinal matches
  const matches: Match[] = [];
  
  // Quarterfinals (round 1)
  for (let i = 0; i < 8; i += 2) {
    matches.push({
      id: `qf-${i/2 + 1}`,
      team1: shuffledTeams[i],
      team2: shuffledTeams[i + 1],
      team1Goals: 0,
      team2Goals: 0,
      round: 1,
      matchNumber: i/2 + 1,
      played: false
    });
  }
  
  // Create semifinal placeholders
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `sf-${i + 1}`,
      team1: {} as Team, // Will be filled later
      team2: {} as Team, // Will be filled later
      team1Goals: 0,
      team2Goals: 0,
      round: 2,
      matchNumber: i + 1,
      played: false
    });
  }
  
  // Create 3rd place and final placeholders
  matches.push({
    id: `3rd-place`,
    team1: {} as Team,
    team2: {} as Team,
    team1Goals: 0,
    team2Goals: 0,
    round: 3,
    matchNumber: 1,
    played: false
  });
  
  matches.push({
    id: `final`,
    team1: {} as Team,
    team2: {} as Team,
    team1Goals: 0,
    team2Goals: 0,
    round: 3,
    matchNumber: 2,
    played: false
  });
  
  return {
    id: `champ-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    teams: shuffledTeams,
    matches,
    completed: false
  };
};

// Simulate match results
export const simulateMatch = (match: Match): Match => {
  const updatedMatch = { ...match };
  updatedMatch.team1Goals = getRandomInt(0, 5);
  updatedMatch.team2Goals = getRandomInt(0, 5);
  updatedMatch.played = true;
  return updatedMatch;
};

// Progress tournament based on played matches
export const progressTournament = (championship: Championship): Championship => {
  const updatedChampionship = { ...championship };
  const { matches } = updatedChampionship;
  
  // Process quarterfinals
  const qfMatches = matches.filter(m => m.round === 1 && m.played);
  if (qfMatches.length === 4) {
    // All quarterfinals are played, setup semifinals
    const sfMatches = matches.filter(m => m.round === 2);
    
    // Determine winners of each quarterfinal
    qfMatches.forEach((match, index) => {
      const { winner, loser } = determineWinner(match, matches);
      match.winner = winner;
      match.loser = loser;
    });
    
    // Set teams for semifinal 1
    sfMatches[0].team1 = qfMatches[0].winner!;
    sfMatches[0].team2 = qfMatches[1].winner!;
    
    // Set teams for semifinal 2
    sfMatches[1].team1 = qfMatches[2].winner!;
    sfMatches[1].team2 = qfMatches[3].winner!;
  }
  
  // Process semifinals
  const sfMatches = matches.filter(m => m.round === 2 && m.played);
  if (sfMatches.length === 2) {
    // All semifinals are played, setup final and 3rd place match
    const finalMatch = matches.find(m => m.id === 'final')!;
    const thirdPlaceMatch = matches.find(m => m.id === '3rd-place')!;
    
    // Determine winners and losers of semifinals
    sfMatches.forEach(match => {
      const { winner, loser } = determineWinner(match, matches);
      match.winner = winner;
      match.loser = loser;
    });
    
    // Set teams for 3rd place match
    thirdPlaceMatch.team1 = sfMatches[0].loser!;
    thirdPlaceMatch.team2 = sfMatches[1].loser!;
    
    // Set teams for final
    finalMatch.team1 = sfMatches[0].winner!;
    finalMatch.team2 = sfMatches[1].winner!;
  }
  
  // Process final and 3rd place
  const finalMatch = matches.find(m => m.id === 'final');
  const thirdPlaceMatch = matches.find(m => m.id === '3rd-place');
  
  if (finalMatch?.played && thirdPlaceMatch?.played) {
    // Tournament is complete
    updatedChampionship.completed = true;
    
    // Determine final positions
    const finalResult = determineWinner(finalMatch, matches);
    const thirdPlaceResult = determineWinner(thirdPlaceMatch, matches);
    
    finalMatch.winner = finalResult.winner;
    finalMatch.loser = finalResult.loser;
    thirdPlaceMatch.winner = thirdPlaceResult.winner;
    thirdPlaceMatch.loser = thirdPlaceResult.loser;
    
    updatedChampionship.winner = finalResult.winner;
    updatedChampionship.runnerUp = finalResult.loser;
    updatedChampionship.thirdPlace = thirdPlaceResult.winner;
    updatedChampionship.fourthPlace = thirdPlaceResult.loser;
  }
  
  return updatedChampionship;
};

// Save championship to local storage
export const saveChampionship = (championship: Championship): void => {
  const championships = getChampionships();
  const updatedList = [...championships, championship];
  localStorage.setItem('championships', JSON.stringify(updatedList));
};

// Get all championships from local storage
export const getChampionships = (): Championship[] => {
  const stored = localStorage.getItem('championships');
  return stored ? JSON.parse(stored) : [];
};

// Get a specific championship by ID
export const getChampionshipById = (id: string): Championship | undefined => {
  const championships = getChampionships();
  return championships.find(c => c.id === id);
};

// Update an existing championship
export const updateChampionship = (championship: Championship): void => {
  const championships = getChampionships();
  const index = championships.findIndex(c => c.id === championship.id);
  if (index !== -1) {
    championships[index] = championship;
    localStorage.setItem('championships', JSON.stringify(championships));
  }
};

// Simulate entire championship at once
export const simulateEntireChampionship = (championship: Championship): Championship => {
  let updatedChampionship = { ...championship };
  
  // Simulate quarterfinals
  updatedChampionship.matches = updatedChampionship.matches.map(match => {
    if (match.round === 1) {
      return simulateMatch(match);
    }
    return match;
  });
  
  // Progress to semifinals
  updatedChampionship = progressTournament(updatedChampionship);
  
  // Simulate semifinals
  updatedChampionship.matches = updatedChampionship.matches.map(match => {
    if (match.round === 2) {
      return simulateMatch(match);
    }
    return match;
  });
  
  // Progress to final and 3rd place
  updatedChampionship = progressTournament(updatedChampionship);
  
  // Simulate final and 3rd place
  updatedChampionship.matches = updatedChampionship.matches.map(match => {
    if (match.round === 3) {
      return simulateMatch(match);
    }
    return match;
  });
  
  // Complete the tournament
  updatedChampionship = progressTournament(updatedChampionship);
  
  return updatedChampionship;
};
