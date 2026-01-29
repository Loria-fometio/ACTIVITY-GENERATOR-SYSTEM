function detectIntent(message) {
  const msg = message.toLowerCase();
  const context = {};

  if (msg.includes("tired") || msg.includes("low")) context.energy = "low";
  if (msg.includes("bored") || msg.includes("relax")) context.goal = "relaxation";
  if (msg.includes("study") || msg.includes("focus")) context.goal = "focus";
  if (msg.includes("15") || msg.includes("20") || msg.includes("30"))
    context.time = parseInt(msg.match(/\d+/)[0]);
  if (msg.includes("home")) context.location = "home";
  if (msg.includes("outside")) context.location = "outside";
  if (msg.includes("office")) context.location = "office";

  return context;
}

module.exports = { detectIntent };
