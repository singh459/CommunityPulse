import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let needs = [];
let volunteers = [];

let needId = 1;
let volId = 1;

// 📌 SCORING FUNCTION
function calculateScore(n) {
  const weights = { 4: 30, 3: 20, 2: 10, 1: 5 };
  return (n.urgency * weights[n.urgency]) + (n.people * 0.5) + (n.days * 5);
}

// 🟢 ADD NEED
app.post("/add-need", (req, res) => {
  const data = req.body;

  const newNeed = {
    id: needId++,
    ...data,
    score: calculateScore(data)
  };

  needs.push(newNeed);
  res.json(newNeed);
});

// 🔵 GET NEEDS
app.get("/needs", (req, res) => {
  res.json(needs);
});

// 🟣 ADD VOLUNTEER
app.post("/add-volunteer", (req, res) => {
  const v = {
    id: volId++,
    ...req.body
  };
  volunteers.push(v);
  res.json(v);
});

// 🟠 GET VOLUNTEERS
app.get("/volunteers", (req, res) => {
  res.json(volunteers);
});

// 🤖 MATCHING
app.get("/match/:needId", (req, res) => {
  const need = needs.find(n => n.id == req.params.needId);

  if (!need) return res.status(404).json({ msg: "Need not found" });

  const matches = volunteers.map(v => {
    let score = 0;

    if (v.skills.includes(need.category)) score += 50;
    if (v.location === need.location) score += 30;
    if (v.status === "available") score += 20;

    return { ...v, matchScore: score };
  });

  matches.sort((a, b) => b.matchScore - a.matchScore);

  res.json(matches);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));