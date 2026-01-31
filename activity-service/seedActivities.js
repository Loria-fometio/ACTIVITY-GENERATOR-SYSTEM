import mongoose from "mongoose";
import dotenv from "dotenv";
import { Activity } from "./models/Activity.js";  // ✅ use named import

dotenv.config();

const activities = [
  {
    "title": "Sunrise Yoga Flow",
    "description": "Start your day with a gentle yoga sequence focused on flexibility and breath awareness.",
    "preference": "fitness",
    "goal": "relaxation",
    "category": ["fitness", "relaxation", "mindfulness"],
    "duration": 30
  },
  {
    "title": "Learn a Classic Pasta Dish",
    "description": "Follow a step-by-step tutorial to master the art of making fresh pasta carbonara from scratch.",
    "preference": "cooking",
    "goal": "skill development",
    "category": ["cooking", "learning"],
    "duration": 60
  },
  {
    "title": "Nature Soundscape Walk",
    "description": "Take a walk in a park or forest, focusing solely on identifying and listening to different natural sounds.",
    "preference": "nature",
    "goal": "mindfulness",
    "category": ["nature", "mindfulness", "relaxation"],
    "duration": 45
  },
  {
    "title": "Drumming Basics Tutorial",
    "description": "Use household items or a practice pad to learn fundamental drumming rhythms and hand techniques.",
    "preference": "music",
    "goal": "skill development",
    "category": ["music", "learning"],
    "duration": 30
  },
  {
    "title": "Read a Short Story",
    "description": "Immerse yourself in a complete fictional narrative from a classic or contemporary author.",
    "preference": "reading",
    "goal": "entertainment",
    "category": ["reading", "entertainment"],
    "duration": 40
  },
  {
    "title": "Ink Sketching Session",
    "description": "Create a series of quick ink sketches of objects around your home, focusing on line and form.",
    "preference": "art",
    "goal": "creativity",
    "category": ["art", "creativity"],
    "duration": 25
  },
  {
    "title": "Coffee Catch-Up",
    "description": "Meet a friend for a coffee and have a dedicated, device-free conversation.",
    "preference": "social",
    "goal": "connection",
    "category": ["social", "relaxation"],
    "duration": 60
  },
  {
    "title": "Learn 10 Phrases in a New Language",
    "description": "Use an app or website to learn and practice a set of basic greetings and phrases in a language you're curious about.",
    "preference": "learning",
    "goal": "skill development",
    "category": ["learning", "language"],
    "duration": 20
  },
  {
    "title": "Co-op Puzzle Game",
    "description": "Team up with a friend online or locally to solve puzzles and progress through a cooperative video game level.",
    "preference": "gaming",
    "goal": "social bonding",
    "category": ["gaming", "social"],
    "duration": 90
  },
  {
    "title": "Guided Body Scan Meditation",
    "description": "Listen to a guided meditation to release tension by mentally scanning and relaxing each part of your body.",
    "preference": "relaxation",
    "goal": "stress relief",
    "category": ["relaxation", "mindfulness"],
    "duration": 20
  },
  {
    "title": "Inbox Zero Challenge",
    "description": "Dedicate time to ruthlessly organize, archive, delete, and respond to emails until your inbox is empty.",
    "preference": "productivity",
    "goal": "organization",
    "category": ["productivity", "organization"],
    "duration": 50
  },
  {
    "title": "HIIT Workout",
    "description": "Perform a high-intensity interval training session with bodyweight exercises like squats, push-ups, and burpees.",
    "preference": "fitness",
    "goal": "cardiovascular health",
    "category": ["fitness"],
    "duration": 25
  },
  {
    "title": "Bake Sourdough Bread",
    "description": "Feed your starter and go through the stages of mixing, folding, proofing, and baking a loaf of artisan bread.",
    "preference": "cooking",
    "goal": "creativity",
    "category": ["cooking", "creativity"],
    "duration": 120
  },
  {
    "title": "Stargazing",
    "description": "Find a dark spot, away from city lights, and identify constellations or simply watch for shooting stars.",
    "preference": "nature",
    "goal": "wonder",
    "category": ["nature", "astronomy"],
    "duration": 60
  },
  {
    "title": "Songwriting Challenge",
    "description": "Set a timer and write the lyrics and melody for a simple song on any instrument you know.",
    "preference": "music",
    "goal": "creativity",
    "category": ["music", "creativity"],
    "duration": 45
  },
  {
    "title": "Read Industry News",
    "description": "Catch up on the latest articles, trends, and developments in your professional field.",
    "preference": "reading",
    "goal": "professional development",
    "category": ["reading", "learning", "productivity"],
    "duration": 30
  },
  {
    "title": "Watercolor Landscape",
    "description": "Paint a simple landscape scene using watercolors, experimenting with wet-on-wet techniques for skies.",
    "preference": "art",
    "goal": "creativity",
    "category": ["art", "creativity", "relaxation"],
    "duration": 60
  },
  {
    "title": "Board Game Night",
    "description": "Host a small gathering to play strategic or party board games with friends or family.",
    "preference": "social",
    "goal": "fun",
    "category": ["social", "gaming"],
    "duration": 120
  },
  {
    "title": "Watch a Documentary",
    "description": "Choose a documentary on a historical event, scientific discovery, or cultural phenomenon to expand your knowledge.",
    "preference": "learning",
    "goal": "knowledge expansion",
    "category": ["learning", "entertainment"],
    "duration": 90
  },
  {
    "title": "Speedrun a Favorite Game",
    "description": "Attempt to complete a level or an entire familiar game as fast as possible, focusing on precision and known shortcuts.",
    "preference": "gaming",
    "goal": "mastery",
    "category": ["gaming"],
    "duration": 45
  },
  {
    "title": "Aromatherapy & Breathing",
    "description": "Use essential oils in a diffuser while practicing deep, mindful breathing exercises.",
    "preference": "relaxation",
    "goal": "calm",
    "category": ["relaxation", "mindfulness"],
    "duration": 15
  },
  {
    "title": "Weekly Planning Session",
    "description": "Review last week's goals and meticulously plan tasks, appointments, and priorities for the upcoming week.",
    "preference": "productivity",
    "goal": "organization",
    "category": ["productivity", "organization"],
    "duration": 30
  },
  {
    "title": "Rock Climbing (Indoor)",
    "description": "Visit a climbing gym to solve bouldering problems or scale a top-rope wall, focusing on technique.",
    "preference": "fitness",
    "goal": "strength building",
    "category": ["fitness", "social"],
    "duration": 90
  },
  {
    "title": "Make Fresh Pesto",
    "description": "Blend fresh basil, pine nuts, garlic, parmesan, and olive oil to create a vibrant homemade pesto sauce.",
    "preference": "cooking",
    "goal": "culinary creation",
    "category": ["cooking"],
    "duration": 25
  },
  {
    "title": "Botanical Garden Visit",
    "description": "Explore a local botanical garden to appreciate the diversity and beauty of plant life from around the world.",
    "preference": "nature",
    "goal": "appreciation",
    "category": ["nature", "photography"],
    "duration": 75
  },
  {
    "title": "Learn a Guitar Solo",
    "description": "Slow down and practice a famous guitar solo note-by-note, focusing on phrasing and expression.",
    "preference": "music",
    "goal": "skill development",
    "category": ["music", "learning"],
    "duration": 45
  },
  {
    "title": "Listen to an Audiobook",
    "description": "Put on headphones and listen to a chapter of a non-fiction or fiction audiobook while on a walk or doing chores.",
    "preference": "reading",
    "goal": "entertainment",
    "category": ["reading", "entertainment", "multitasking"],
    "duration": 40
  },
  {
    "title": "Pottery Throw",
    "description": "Visit a pottery studio and learn to center clay and throw a basic bowl or cup on a wheel.",
    "preference": "art",
    "goal": "skill development",
    "category": ["art", "creativity", "learning"],
    "duration": 90
  },
  {
    "title": "Volunteer at a Food Bank",
    "description": "Spend a few hours sorting, packing, or distributing food for those in need in your community.",
    "preference": "social",
    "goal": "contribution",
    "category": ["social", "volunteering"],
    "duration": 120
  },
  {
    "title": "Online Course Module",
    "description": "Complete one module or lesson from an online course you're enrolled in, taking detailed notes.",
    "preference": "learning",
    "goal": "skill development",
    "category": ["learning", "productivity"],
    "duration": 60
  },
  {
    "title": "Fighting Game Practice",
    "description": "Head to training mode in your favorite fighting game to practice combos, blocks, and frame data.",
    "preference": "gaming",
    "goal": "skill development",
    "category": ["gaming"],
    "duration": 30
  },
  {
    "title": "Float Tank Session",
    "description": "Experience sensory deprivation in a float tank to achieve deep mental and physical relaxation.",
    "preference": "relaxation",
    "goal": "sensory reset",
    "category": ["relaxation", "mindfulness"],
    "duration": 90
  },
  {
    "title": "Digital File Clean-Up",
    "description": "Organize your computer's desktop and documents folder, deleting old files and creating a logical folder structure.",
    "preference": "productivity",
    "goal": "organization",
    "category": ["productivity", "digital"],
    "duration": 50
  },
  {
    "title": "Swimming Laps",
    "description": "Swim continuous laps at your local pool, focusing on stroke technique and breathing rhythm.",
    "preference": "fitness",
    "goal": "cardiovascular health",
    "category": ["fitness"],
    "duration": 45
  },
  {
    "title": "Ferment Your Own Hot Sauce",
    "description": "Chop peppers, add garlic and brine, and begin the fermentation process for a unique homemade hot sauce.",
    "preference": "cooking",
    "goal": "culinary creation",
    "category": ["cooking", "science"],
    "duration": 35
  },
  {
    "title": "Geocaching Adventure",
    "description": "Use a GPS app to find hidden containers (geocaches) placed in your local area by other players.",
    "preference": "nature",
    "goal": "adventure",
    "category": ["nature", "gaming", "outdoors"],
    "duration": 90
  },
  {
    "title": "Jam Session",
    "description": "Improvise music freely with friends, exploring melodies and rhythms without a strict plan.",
    "preference": "music",
    "goal": "creativity",
    "category": ["music", "social", "creativity"],
    "duration": 60
  },
  {
    "title": "Read Poetry",
    "description": "Read a selection of poems from a single poet or an anthology, reflecting on the imagery and emotion.",
    "preference": "reading",
    "goal": "reflection",
    "category": ["reading", "art"],
    "duration": 25
  },
  {
    "title": "Digital Collage Art",
    "description": "Use free software to create a collage from found digital images, exploring themes and composition.",
    "preference": "art",
    "goal": "creativity",
    "category": ["art", "digital", "creativity"],
    "duration": 50
  },
  {
    "title": "Join a Club Meeting",
    "description": "Attend a meeting for a local book club, hiking group, or other interest-based club to meet new people.",
    "preference": "social",
    "goal": "connection",
    "category": ["social", "learning"],
    "duration": 90
  },
  {
    "title": "TED Talk Deep Dive",
    "description": "Watch a TED Talk on a novel topic and then research one of its key concepts further online.",
    "preference": "learning",
    "goal": "knowledge expansion",
    "category": ["learning"],
    "duration": 45
  },
  {
    "title": "City Builder Game",
    "description": "Design and manage a sprawling city, balancing zoning, services, and budget in a simulation game.",
    "preference": "gaming",
    "goal": "creativity",
    "category": ["gaming", "creativity"],
    "duration": 75
  },
  {
    "title": "Gentle Stretching",
    "description": "Perform a series of slow, static stretches targeting major muscle groups to improve flexibility and release tension.",
    "preference": "relaxation",
    "goal": "tension relief",
    "category": ["relaxation", "fitness"],
    "duration": 20
  },
  {
    "title": "Brainstorm Project Ideas",
    "description": "Use a whiteboard or mind-mapping tool to freely generate and connect ideas for a future project.",
    "preference": "productivity",
    "goal": "ideation",
    "category": ["productivity", "creativity"],
    "duration": 30
  },
  {
    "title": "Trail Running",
    "description": "Go for a run on a natural trail, adapting your pace to the varying terrain and elevation.",
    "preference": "fitness",
    "goal": "cardiovascular health",
    "category": ["fitness", "nature"],
    "duration": 50
  },
  {
    "title": "Knife Skills Practice",
    "description": "Practice precise chopping, dicing, and mincing on vegetables like onions, carrots, and celery to improve speed and safety.",
    "preference": "cooking",
    "goal": "skill development",
    "category": ["cooking", "learning"],
    "duration": 30
  },
  {
    "title": "Bird Watching",
    "description": "Sit quietly in a natural area with binoculars and a guidebook to identify local bird species.",
    "preference": "nature",
    "goal": "mindfulness",
    "category": ["nature", "mindfulness"],
    "duration": 60
  },
  {
    "title": "Music Production: Make a Beat",
    "description": "Open a digital audio workstation and create a simple drum beat and bassline using virtual instruments.",
    "preference": "music",
    "goal": "creativity",
    "category": ["music", "digital", "creativity"],
    "duration": 60
  },
  {
    "title": "Read a Long-Form Article",
    "description": "Dive into an in-depth magazine or online article that explores a complex issue with nuance.",
    "preference": "reading",
    "goal": "knowledge expansion",
    "category": ["reading", "learning"],
    "duration": 35
  },
  {
    "title": "Life Drawing Session",
    "description": "Attend a session with a live model to practice quick gesture drawings and longer studies of human form.",
    "preference": "art",
    "goal": "skill development",
    "category": ["art", "learning"],
    "duration": 120
  },
  {
    "title": "Play with a Pet",
    "description": "Engage in active play with your dog, cat, or other pet using their favorite toys.",
    "preference": "social",
    "goal": "bonding",
    "category": ["social", "pets", "fun"],
    "duration": 20
  },
  {
    "title": "Learn Basic First Aid",
    "description": "Watch instructional videos and practice skills like CPR, the Heimlich maneuver, or treating minor wounds.",
    "preference": "learning",
    "goal": "preparedness",
    "category": ["learning", "health"],
    "duration": 60
  },
  {
    "title": "VR Exploration",
    "description": "Put on a VR headset and explore a virtual museum, a fantastical landscape, or a puzzle environment.",
    "preference": "gaming",
    "goal": "immersion",
    "category": ["gaming", "technology"],
    "duration": 40
  },
  {
    "title": "Herbal Tea Ritual",
    "description": "Mindfully prepare and sip a cup of herbal tea, focusing on the warmth, aroma, and flavor.",
    "preference": "relaxation",
    "goal": "mindfulness",
    "category": ["relaxation", "mindfulness"],
    "duration": 15
  },
  {
    "title": "Declutter a Drawer",
    "description": "Completely empty one junk drawer, sort the contents, discard trash, and neatly reorganize what you keep.",
    "preference": "productivity",
    "goal": "organization",
    "category": ["productivity", "home"],
    "duration": 25
  },
  {
    "title": "Strength Training",
    "description": "Complete a full-body workout using free weights or machines, focusing on compound movements.",
    "preference": "fitness",
    "goal": "strength building",
    "category": ["fitness"],
    "duration": 60
  },
  {
    "title": "Make Homemade Pizza",
    "description": "Prepare dough from scratch, choose your toppings, and bake a personalized pizza.",
    "preference": "cooking",
    "goal": "culinary creation",
    "category": ["cooking", "fun"],
    "duration": 90
  },
  {
    "title": "Sunset Photography",
    "description": "Go to a scenic location and practice capturing the changing colors and light of the sunset with your camera.",
    "preference": "nature",
    "goal": "creativity",
    "category": ["nature", "photography", "art"],
    "duration": 50
  },
  {
    "title": "Learn a Jazz Standard",
    "description": "Learn the chord changes and melody of a classic jazz tune on your instrument of choice.",
    "preference": "music",
    "goal": "skill development",
    "category": ["music", "learning"],
    "duration": 50
  },
  {
    "title": "Speed-Read a Chapter",
    "description": "Practice speed-reading techniques on a non-fiction book chapter to absorb key information quickly.",
    "preference": "reading",
    "goal": "efficiency",
    "category": ["reading", "productivity"],
    "duration": 20
  },
  {
    "title": "Origami",
    "description": "Follow instructions to fold paper into intricate animal or geometric shapes.",
    "preference": "art",
    "goal": "creativity",
    "category": ["art", "crafts"],
    "duration": 40
  },
  {
    "title": "Write a Letter",
    "description": "Handwrite a thoughtful letter or postcard to a friend or family member you haven't spoken to in a while.",
    "preference": "social",
    "goal": "connection",
    "category": ["social", "writing"],
    "duration": 30
  },
  {
    "title": "Fix a Household Item",
    "description": "Attempt to repair a broken appliance, piece of furniture, or gadget using online tutorials and basic tools.",
    "preference": "learning",
    "goal": "problem solving",
    "category": ["learning", "productivity", "home"],
    "duration": 75
  },
  {
    "title": "Retro Gaming Marathon",
    "description": "Play through levels of a classic video game from your childhood, embracing the nostalgia.",
    "preference": "gaming",
    "goal": "entertainment",
    "category": ["gaming", "nostalgia"],
    "duration": 90
  },
  {
    "title": "Nap",
    "description": "Take a short, intentional power nap to recharge your energy and mental focus.",
    "preference": "relaxation",
    "goal": "energy restoration",
    "category": ["relaxation", "health"],
    "duration": 20
  },
  {
    "title": "Update Your Resume",
    "description": "Refresh your resume with recent accomplishments, skills, and a modern format.",
    "preference": "productivity",
    "goal": "professional development",
    "category": ["productivity", "career"],
    "duration": 60
  },
  {
    "title": "Dance Workout",
    "description": "Follow along to a high-energy dance fitness video to get your heart rate up in a fun way.",
    "preference": "fitness",
    "goal": "cardiovascular health",
    "category": ["fitness", "music", "fun"],
    "duration": 30
  },
  {
    "title": "Brew Pour-Over Coffee",
    "description": "Mindfully brew a single cup of coffee using the pour-over method, controlling water temperature and pour rate.",
    "preference": "cooking",
    "goal": "mindfulness",
    "category": ["cooking", "mindfulness"],
    "duration": 15
  },
  {
    "title": "Forage for Edibles",
    "description": "Safely identify and collect edible wild plants, berries, or mushrooms in your area (with a guide).",
    "preference": "nature",
    "goal": "connection",
    "category": ["nature", "cooking", "learning"],
    "duration": 80
  },
  {
    "title": "Listen to a New Album",
    "description": "Listen to an entire album from an artist you've never heard before, focusing on the composition and lyrics.",
    "preference": "music",
    "goal": "cultural expansion",
    "category": ["music", "entertainment"],
    "duration": 55
  },
  {
    "title": "Research Your Family Tree",
    "description": "Use online archives and databases to uncover information about your ancestors and build a family tree.",
    "preference": "reading",
    "goal": "discovery",
    "category": ["reading", "learning", "history"],
    "duration": 90
  },
  {
    "title": "Sculpt with Clay",
    "description": "Use air-dry or polymer clay to sculpt a small figurine, abstract shape, or functional item.",
    "preference": "art",
    "goal": "creativity",
    "category": ["art", "crafts", "creativity"],
    "duration": 70
  },
  {
    "title": "Host a Dinner Party",
    "description": "Plan a menu, cook a meal, and host a small group of friends for an evening of food and conversation.",
    "preference": "social",
    "goal": "entertaining",
    "category": ["social", "cooking"],
    "duration": 120
  },
  {
    "title": "Memorize a Poem",
    "description": "Choose a short poem and use repetition and visualization techniques to commit it to memory.",
    "preference": "learning",
    "goal": "mental exercise",
    "category": ["learning", "memory"],
    "duration": 25
  },
  {
    "title": "Explore a New MMO",
    "description": "Create a character and complete the introductory quests in a massive multiplayer online game world.",
    "preference": "gaming",
    "goal": "exploration",
    "category": ["gaming", "social"],
    "duration": 90
  },
  {
    "title": "Progressive Muscle Relaxation",
    "description": "Systematically tense and then relax each muscle group in your body to achieve deep physical calm.",
    "preference": "relaxation",
    "goal": "tension relief",
    "category": ["relaxation", "mindfulness"],
    "duration": 20
  },
  {
    "title": "Plan a Weekend Trip",
    "description": "Research destinations, book accommodations, and create a rough itinerary for a future weekend getaway.",
    "preference": "productivity",
    "goal": "future enjoyment",
    "category": ["productivity", "travel", "planning"],
    "duration": 45
  },
  {
    "title": "Martial Arts Drills",
    "description": "Practice fundamental strikes, kicks, blocks, or forms from a martial art like Karate, Taekwondo, or Boxing.",
    "preference": "fitness",
    "goal": "skill development",
    "category": ["fitness", "learning"],
    "duration": 40
  },
  {
    "title": "Make Salad Dressings",
    "description": "Whisk together three different homemade salad dressings (e.g., vinaigrette, creamy herb, tahini) to have on hand.",
    "preference": "cooking",
    "goal": "culinary creation",
    "category": ["cooking"],
    "duration": 30
  },
  {
    "title": "Kite Flying",
    "description": "Find a windy, open field and fly a kite, focusing on keeping it stable and aloft.",
    "preference": "nature",
    "goal": "fun",
    "category": ["nature", "outdoors", "fun"],
    "duration": 60
  },
  {
    "title": "Practice Vocal Warm-Ups",
    "description": "Run through scales, arpeggios, and breathing exercises to improve your singing technique and range.",
    "preference": "music",
    "goal": "skill development",
    "category": ["music", "learning"],
    "duration": 25
  },
  {
    "title": "Read a Biography",
    "description": "Spend time reading about the life, challenges, and achievements of a notable historical figure.",
    "preference": "reading",
    "goal": "inspiration",
    "category": ["reading", "learning", "history"],
    "duration": 50
  },
  {
    "title": "Street Photography Walk",
    "description": "Take a walk in an urban area and capture candid moments, interesting characters, and architectural details.",
    "preference": "art",
    "goal": "creativity",
    "category": ["art", "photography", "exploration"],
    "duration": 75
  },
  {
    "title": "Play a Sport",
    "description": "Join a pick-up game or practice session for a sport like basketball, soccer, or tennis.",
    "preference": "social",
    "goal": "fitness",
    "category": ["social", "fitness", "sports"],
    "duration": 90
  },
  {
    "title": "Learn to Juggle",
    "description": "Start with one ball, then two, and progress to three, practicing hand-eye coordination and rhythm.",
    "preference": "learning",
    "goal": "skill development",
    "category": ["learning", "fun"],
    "duration": 30
  },
  {
    "title": "Strategy Puzzle Game",
    "description": "Solve complex, turn-based puzzles that require planning several steps ahead.",
    "preference": "gaming",
    "goal": "problem solving",
    "category": ["gaming", "puzzle"],
    "duration": 40
  },
  {
    "title": "Warm Bath with Epsom Salts",
    "description": "Draw a warm bath, add Epsom salts and essential oils, and soak to relax muscles and unwind.",
    "preference": "relaxation",
    "goal": "physical relaxation",
    "category": ["relaxation", "self-care"],
    "duration": 45
  },
  {
    "title": "Automate a Task",
    "description": "Set up a digital automation (e.g., IFTTT, Zapier, or a simple script) to handle a repetitive computer task.",
    "preference": "productivity",
    "goal": "efficiency",
    "category": ["productivity", "technology"],
    "duration": 60
  },
  {
    "title": "Pilates Core Workout",
    "description": "Focus on controlled movements to strengthen your core muscles, improve posture, and increase flexibility.",
    "preference": "fitness",
    "goal": "core strength",
    "category": ["fitness"],
    "duration": 35
  },
  {
    "title": "Taste Test Comparison",
    "description": "Buy two or three different brands of the same food item (e.g., chocolate, olive oil) and compare their flavors.",
    "preference": "cooking",
    "goal": "sensory exploration",
    "category": ["cooking", "fun"],
    "duration": 30
  },
  {
    "title": "Build a Fort",
    "description": "Use blankets, pillows, and furniture to construct an elaborate indoor fort for reading or relaxing.",
    "preference": "fun",
    "goal": "playfulness",
    "category": ["fun", "creativity", "home"],
    "duration": 40
  },
  {
    "title": "Learn Bird Calls",
    "description": "Listen to recordings and practice identifying common bird calls in your region.",
    "preference": "nature",
    "goal": "skill development",
    "category": ["nature", "learning"],
    "duration": 30
  },
  {
    "title": "Compose a Melody on Piano",
    "description": "Sit at a keyboard and experiment with notes until you create a simple, original melodic phrase.",
    "preference": "music",
    "goal": "creativity",
    "category": ["music", "creativity"],
    "duration": 35
  },
  {
    "title": "Read a Play Script",
    "description": "Read a script for a stage play aloud, imagining the staging and trying out different character voices.",
    "preference": "reading",
    "goal": "entertainment",
    "category": ["reading", "art", "performance"],
    "duration": 60
  },
  {
    "title": "Visit an Art Museum",
    "description": "Spend time observing and contemplating artworks in a local art museum or gallery.",
    "preference": "art",
    "goal": "cultural appreciation",
    "category": ["art", "culture", "learning"],
    "duration": 90
  },
  {
    "title": "Plan a Surprise",
    "description": "Organize a small surprise for someone you care about, like a gift, a visit, or a special meal.",
    "preference": "social",
    "goal": "kindness",
    "category": ["social", "planning"],
    "duration": 45
  },
  {
    "title": "Study a Map",
    "description": "Take out a physical map (topographic, road, or world) and study the geography of an area that interests you.",
    "preference": "learning",
    "goal": "knowledge expansion",
    "category": ["learning", "geography"],
    "duration": 30
  },
  {
    "title": "Creative Mode Building (Minecraft)",
    "description": "Enter a sandbox game's creative mode and build an elaborate structure without resource constraints.",
    "preference": "gaming",
    "goal": "creativity",
    "category": ["gaming", "creativity"],
    "duration": 80
  },
  {
    "title": "Gratitude Journaling",
    "description": "Write down three to five specific things you are grateful for today, reflecting on why they matter.",
    "preference": "relaxation",
    "goal": "mindfulness",
    "category": ["relaxation", "mindfulness", "writing"],
    "duration": 15
  },
  {
    "title": "Learn a Keyboard Shortcut",
    "description": "Master a new, powerful keyboard shortcut for an application you use daily (e.g., Photoshop, Excel, your code editor).",
    "preference": "productivity",
    "goal": "efficiency",
    "category": ["productivity", "learning", "technology"],
    "duration": 20
  },
  {
    "title": "Listen to jazz",
    "description": "Explore relaxing jazz tracks",
    "preference": "music",
    "goal": "relaxation",
    "category": ["music"],
    "duration": 30
  },
  {
    "title": "Practice guitar",
    "description": "Work on chord progressions",
    "preference": "music",
    "goal": "skill",
    "category": ["music"],
    "duration": 45
  },
  {
    "title": "Compose a short melody",
    "description": "Experiment with new sounds",
    "preference": "music",
    "goal": "creativity",
    "category": ["music"],
    "duration": 40
  },
  {
    "title": "Sketch nature",
    "description": "Draw a calming nature scene",
    "preference": "art",
    "goal": "relaxation",
    "category": ["art"],
    "duration": 30
  },
  {
    "title": "Digital illustration",
    "description": "Create art on tablet",
    "preference": "art",
    "goal": "creativity",
    "category": ["art"],
    "duration": 50
  },
  {
    "title": "Mandala coloring",
    "description": "Color intricate mandala patterns",
    "preference": "art",
    "goal": "mindfulness",
    "category": ["art"],
    "duration": 25
  },
  {
    "title": "Jogging",
    "description": "Light jogging for stamina",
    "preference": "sport",
    "goal": "fitness",
    "category": ["sport"],
    "duration": 30
  },
  {
    "title": "Yoga session",
    "description": "Stretch and breathe",
    "preference": "sport",
    "goal": "fitness",
    "category": ["sport"],
    "duration": 45
  },
  {
    "title": "Play basketball",
    "description": "Casual game with friends",
    "preference": "sport",
    "goal": "social connection",
    "category": ["sport"],
    "duration": 60
  },
  {
    "title": "Swimming",
    "description": "Gentle laps in the pool",
    "preference": "sport",
    "goal": "relaxation",
    "category": ["sport"],
    "duration": 40
  },
  {
    "title": "Bake bread",
    "description": "Try a simple homemade recipe",
    "preference": "cooking",
    "goal": "skill",
    "category": ["cooking"],
    "duration": 90
  },
  {
    "title": "Cook a new dish",
    "description": "Experiment with international cuisine",
    "preference": "cooking",
    "goal": "fun",
    "category": ["cooking"],
    "duration": 60
  },
  {
    "title": "Meal prep",
    "description": "Organize healthy meals for the week",
    "preference": "cooking",
    "goal": "productivity",
    "category": ["cooking"],
    "duration": 120
  },
  {
    "title": "Learn a new language",
    "description": "Practice basic phrases",
    "preference": "study",
    "goal": "knowledge",
    "category": ["study"],
    "duration": 45
  },
  {
    "title": "Solve math puzzles",
    "description": "Sharpen problem-solving skills",
    "preference": "study",
    "goal": "achievement",
    "category": ["study"],
    "duration": 30
  },
  {
    "title": "Read a science article",
    "description": "Expand your knowledge",
    "preference": "study",
    "goal": "knowledge",
    "category": ["study"],
    "duration": 20
  },
  {
    "title": "Plan a weekend trip",
    "description": "Research nearby destinations",
    "preference": "travel",
    "goal": "fun",
    "category": ["travel"],
    "duration": 60
  },
  {
    "title": "Virtual museum tour",
    "description": "Explore art collections online",
    "preference": "travel",
    "goal": "knowledge",
    "category": ["travel"],
    "duration": 45
  },
  {
    "title": "Discover local landmarks",
    "description": "Visit cultural sites nearby",
    "preference": "travel",
    "goal": "exploration",
    "category": ["travel"],
    "duration": 90
  },
  {
    "title": "Meditation",
    "description": "Practice deep breathing and focus",
    "preference": "wellness",
    "goal": "mindfulness",
    "category": ["wellness"],
    "duration": 20
  },
  {
    "title": "Stretching routine",
    "description": "Loosen muscles and relax",
    "preference": "wellness",
    "goal": "relaxation",
    "category": ["wellness"],
    "duration": 25
  },
  {
    "title": "Gratitude journaling",
    "description": "Write down positive thoughts",
    "preference": "wellness",
    "goal": "productivity",
    "category": ["wellness"],
    "duration": 15
  },
  {
    "title": "Play a strategy game",
    "description": "Challenge your planning skills",
    "preference": "gaming",
    "goal": "fun",
    "category": ["gaming"],
    "duration": 60
  },
  {
    "title": "Multiplayer session",
    "description": "Connect with friends online",
    "preference": "gaming",
    "goal": "social connection",
    "category": ["gaming"],
    "duration": 90
  },
  {
    "title": "Try a new indie game",
    "description": "Explore creative gameplay",
    "preference": "gaming",
    "goal": "innovation",
    "category": ["gaming"],
    "duration": 45
  },
  {
    "title": "Go hiking",
    "description": "Enjoy fresh air and scenery",
    "preference": "nature",
    "goal": "relaxation",
    "category": ["nature"],
    "duration": 120
  },
  {
    "title": "Bird watching",
    "description": "Observe local wildlife",
    "preference": "nature",
    "goal": "knowledge",
    "category": ["nature"],
    "duration": 60
  },
  {
    "title": "Gardening",
    "description": "Plant flowers or vegetables",
    "preference": "nature",
    "goal": "productivity",
    "category": ["nature"],
    "duration": 90
  },
  {
    "title": "Read a book",
    "description": "Pick a relaxing novel",
    "preference": "general",
    "goal": "relaxation",
    "category": ["general"],
    "duration": 40
  },
  {
    "title": "Organize workspace",
    "description": "Declutter and tidy up your desk",
    "preference": "general",
    "goal": "productivity",
    "category": ["general"],
    "duration": 25
  },
  {
    "title": "Watch a movie",
    "description": "Enjoy a light comedy film",
    "preference": "general",
    "goal": "fun",
    "category": ["general"],
    "duration": 120
  }

];
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    
    await Activity.deleteMany({});
    await Activity.insertMany(activities);
    console.log(`✅ Seeded ${activities.length} diverse activities successfully`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding activities:", err);
    await mongoose.disconnect();
  }
}

seed();
