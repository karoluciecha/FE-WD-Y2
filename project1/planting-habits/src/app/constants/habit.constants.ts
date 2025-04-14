export const LEVEL_THRESHOLDS: number[] = [
    0,   // Level 0: 0 logs
    1,   // Level 1: 1 log
    5,   // Level 2: 5 logs
    10,  // Level 3: 10 logs
    25,  // Level 4: 25 logs
    50,  // Level 5: 50 logs
    69,  // Level 6: 69 logs (easter egg)
    100, // Level 7: 100 logs
    250, // Level 8: 250 logs
    500, // Level 9: 500 logs
    1000 // Level 10: 1000 logs
  ];
  
  export const FREQUENCY_INTERVALS: { [key: string]: number } = {
    'Every day': 1,
    'Every other day': 2,
    'Every week': 7,
    'Every two weeks': 14,
    'Every month': 30,
    'Every quarter': 91,
    'Every 6 months': 182,
    'Every year': 365
  };
  