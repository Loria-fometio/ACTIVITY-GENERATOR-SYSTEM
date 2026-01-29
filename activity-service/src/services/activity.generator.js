const activities = require("../../data/activities_1000.json");

function generateActivity(context) {
  const { energy, goal, time, location } = context;

  // Filter by energy, goal (category), and location
  let filtered = activities.filter(a => 
    a.energy === energy &&
    a.category.toLowerCase() === goal.toLowerCase() &&
    (a.environment  === location || a.environment === "any") &&
    a.time <= time
  );

  // If nothing found, fallback to any activity matching goal & time
  if (!filtered.length) {
    filtered = activities.filter(a =>
      a.category.toLowerCase() === goal.toLowerCase() &&
      a.time <= time
    );
  }

  // Pick randomly from filtered
  const selected = filtered[Math.floor(Math.random() * filtered.length)];

  return {
    activity: selected ? selected.title : "No suitable activity found",
    duration: selected ? selected.time : time,
    goal,
    energy,
    location,
    explanation: "Generated using rule-based reasoning over a structured knowledge dataset"
  };
}

module.exports = { generateActivity };
