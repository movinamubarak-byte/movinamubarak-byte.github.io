export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const questions: Question[] = [
  // Round 1: Common Sense (11 questions)
  { id: 1, category: "Common Sense", question: "What is the color of the sky on a clear day?", options: ["Green", "Blue", "Yellow", "Red"], correctAnswer: 1 },
  { id: 2, category: "Common Sense", question: "How many days are there in a week?", options: ["5", "6", "7", "8"], correctAnswer: 2 },
  { id: 3, category: "Common Sense", question: "Which animal is known as 'Man's Best Friend'?", options: ["Cat", "Dog", "Parrot", "Horse"], correctAnswer: 1 },
  { id: 4, category: "Common Sense", question: "What do you use to write on paper?", options: ["Spoon", "Pen", "Fork", "Key"], correctAnswer: 1 },
  { id: 5, category: "Common Sense", question: "How many hours are in a day?", options: ["12", "20", "24", "48"], correctAnswer: 2 },
  { id: 6, category: "Common Sense", question: "What season comes after summer?", options: ["Winter", "Spring", "Autumn", "Monsoon"], correctAnswer: 2 },
  { id: 7, category: "Common Sense", question: "Which meal do we typically eat in the morning?", options: ["Lunch", "Dinner", "Breakfast", "Snack"], correctAnswer: 2 },
  { id: 8, category: "Common Sense", question: "What do bees make?", options: ["Milk", "Honey", "Sugar", "Butter"], correctAnswer: 1 },
  { id: 9, category: "Common Sense", question: "How many fingers do humans have on both hands?", options: ["8", "10", "12", "6"], correctAnswer: 1 },
  { id: 10, category: "Common Sense", question: "What is frozen water called?", options: ["Steam", "Ice", "Gas", "Vapor"], correctAnswer: 1 },
  { id: 11, category: "Common Sense", question: "Which planet do we live on?", options: ["Mars", "Venus", "Earth", "Jupiter"], correctAnswer: 2 },

  // Round 2: Science (11 questions)
  { id: 12, category: "Science", question: "What gas do humans breathe in?", options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"], correctAnswer: 2 },
  { id: 13, category: "Science", question: "What is H2O commonly known as?", options: ["Salt", "Sugar", "Water", "Oil"], correctAnswer: 2 },
  { id: 14, category: "Science", question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Saturn"], correctAnswer: 2 },
  { id: 15, category: "Science", question: "What force keeps us on the ground?", options: ["Magnetism", "Friction", "Gravity", "Tension"], correctAnswer: 2 },
  { id: 16, category: "Science", question: "What is the center of an atom called?", options: ["Electron", "Proton", "Neutron", "Nucleus"], correctAnswer: 3 },
  { id: 17, category: "Science", question: "Which organ pumps blood in our body?", options: ["Lungs", "Brain", "Heart", "Liver"], correctAnswer: 2 },
  { id: 18, category: "Science", question: "What type of animal is a frog?", options: ["Mammal", "Reptile", "Amphibian", "Bird"], correctAnswer: 2 },
  { id: 19, category: "Science", question: "How many bones are in the adult human body?", options: ["106", "206", "306", "186"], correctAnswer: 1 },
  { id: 20, category: "Science", question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], correctAnswer: 2 },
  { id: 21, category: "Science", question: "What do plants need to perform photosynthesis?", options: ["Darkness", "Sunlight", "Cold", "Wind"], correctAnswer: 1 },
  { id: 22, category: "Science", question: "Which is the largest mammal on Earth?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"], correctAnswer: 1 },

  // Round 3: General Knowledge (11 questions)
  { id: 23, category: "General Knowledge", question: "What is the capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], correctAnswer: 1 },
  { id: 24, category: "General Knowledge", question: "Which is the largest continent?", options: ["Africa", "Europe", "Asia", "Australia"], correctAnswer: 2 },
  { id: 25, category: "General Knowledge", question: "What is the national bird of India?", options: ["Sparrow", "Eagle", "Peacock", "Parrot"], correctAnswer: 2 },
  { id: 26, category: "General Knowledge", question: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"], correctAnswer: 1 },
  { id: 27, category: "General Knowledge", question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Dollar"], correctAnswer: 2 },
  { id: 28, category: "General Knowledge", question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: 3 },
  { id: 29, category: "General Knowledge", question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"], correctAnswer: 1 },
  { id: 30, category: "General Knowledge", question: "What is the tallest mountain in the world?", options: ["K2", "Everest", "Kangchenjunga", "Makalu"], correctAnswer: 1 },
  { id: 31, category: "General Knowledge", question: "Which country gifted the Statue of Liberty to USA?", options: ["UK", "Germany", "France", "Italy"], correctAnswer: 2 },
  { id: 32, category: "General Knowledge", question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Antarctic", "Arabian"], correctAnswer: 2 },
  { id: 33, category: "General Knowledge", question: "How many continents are there?", options: ["5", "6", "7", "8"], correctAnswer: 2 },

  // Round 4: Ismaili History (11 questions)
  { id: 34, category: "Ismaili History", question: "Who is the present Imam of Ismaili Muslims?", options: ["Aga Khan I", "Aga Khan III", "Aga Khan IV", "Aga Khan II"], correctAnswer: 2 },
  { id: 35, category: "Ismaili History", question: "What year did Mawlana Hazar Imam become Imam?", options: ["1947", "1957", "1967", "1977"], correctAnswer: 1 },
  { id: 36, category: "Ismaili History", question: "What is the name of the Ismaili prayer house?", options: ["Mosque", "Jamatkhana", "Temple", "Church"], correctAnswer: 1 },
  { id: 37, category: "Ismaili History", question: "Which Imam established the Aga Khan Development Network?", options: ["Aga Khan I", "Aga Khan III", "Aga Khan IV", "Aga Khan II"], correctAnswer: 2 },
  { id: 38, category: "Ismaili History", question: "What is 'Farmaan'?", options: ["A prayer", "Guidance from Imam", "A festival", "A building"], correctAnswer: 1 },
  { id: 39, category: "Ismaili History", question: "Where was Mawlana Hazar Imam born?", options: ["London", "Paris", "Geneva", "Mumbai"], correctAnswer: 2 },
  { id: 40, category: "Ismaili History", question: "What does AKDN stand for?", options: ["Aga Khan Development Network", "Aga Khan Daily News", "Aga Khan District Network", "Aga Khan Democracy Network"], correctAnswer: 0 },
  { id: 41, category: "Ismaili History", question: "Which university was founded by the Aga Khan?", options: ["Oxford", "Harvard", "Aga Khan University", "Cambridge"], correctAnswer: 2 },
  { id: 42, category: "Ismaili History", question: "What is Imamat Day?", options: ["Birthday of Imam", "Day Imam assumed office", "New Year", "Prayer day"], correctAnswer: 1 },
  { id: 43, category: "Ismaili History", question: "In which city is the Aga Khan Museum located?", options: ["London", "Dubai", "Toronto", "Paris"], correctAnswer: 2 },
  { id: 44, category: "Ismaili History", question: "What century did Fatimid Caliphate begin?", options: ["8th", "9th", "10th", "11th"], correctAnswer: 2 },

  // Round 5: Bollywood & Puzzles (11 questions)
  { id: 45, category: "Bollywood", question: "Who is known as the 'King of Bollywood'?", options: ["Aamir Khan", "Shah Rukh Khan", "Salman Khan", "Akshay Kumar"], correctAnswer: 1 },
  { id: 46, category: "Bollywood", question: "Which film won India's first Oscar for Best Song?", options: ["Lagaan", "Slumdog Millionaire", "RRR", "Gandhi"], correctAnswer: 2 },
  { id: 47, category: "Bollywood", question: "Who directed 'Dangal'?", options: ["Karan Johar", "Nitesh Tiwari", "Rajkumar Hirani", "Rohit Shetty"], correctAnswer: 1 },
  { id: 48, category: "Bollywood", question: "Which actress played in 'Queen' (2014)?", options: ["Priyanka Chopra", "Deepika Padukone", "Kangana Ranaut", "Alia Bhatt"], correctAnswer: 2 },
  { id: 49, category: "Bollywood", question: "What is the famous dialogue: 'Mogambo khush hua' from?", options: ["Sholay", "Mr. India", "DDLJ", "Dil"], correctAnswer: 1 },
  { id: 50, category: "Puzzles", question: "What has keys but no locks?", options: ["Door", "Piano", "Car", "Safe"], correctAnswer: 1 },
  { id: 51, category: "Puzzles", question: "I have hands but cannot clap. What am I?", options: ["Robot", "Clock", "Glove", "Statue"], correctAnswer: 1 },
  { id: 52, category: "Puzzles", question: "What gets wetter the more it dries?", options: ["Sponge", "Towel", "Paper", "Cloth"], correctAnswer: 1 },
  { id: 53, category: "Puzzles", question: "What has a head and tail but no body?", options: ["Snake", "Coin", "Spoon", "Arrow"], correctAnswer: 1 },
  { id: 54, category: "Puzzles", question: "What can travel around the world while staying in a corner?", options: ["Bird", "Stamp", "Wind", "Light"], correctAnswer: 1 },
  { id: 55, category: "Puzzles", question: "What has many teeth but cannot bite?", options: ["Shark", "Comb", "Saw", "Zipper"], correctAnswer: 1 },
];

export const getRoundName = (questionIndex: number): string => {
  if (questionIndex < 11) return "Round 1: Common Sense";
  if (questionIndex < 22) return "Round 2: Science";
  if (questionIndex < 33) return "Round 3: General Knowledge";
  if (questionIndex < 44) return "Round 4: Ismaili History";
  return "Round 5: Bollywood & Puzzles";
};

export const TOTAL_QUESTIONS = questions.length;
export const QUESTION_TIME = 30; // seconds
export const POINTS_PER_CORRECT = 10;
