import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { collegeMatchesSearch } from "./src/utils/search";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for JSON requests
app.use(express.json());

// Resolve paths
const dbPath = path.join(process.cwd(), "server", "db.json");

// Local DB connection helpers
interface DatabaseSchema {
  colleges: any[];
  users: any[];
  savedColleges: { id: string; userId: string; collegeId: string; createdAt: string }[];
  discussions: DiscussionThread[];
}

interface DiscussionAnswer {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

interface DiscussionThread {
  id: string;
  title: string;
  body: string;
  collegeSlug: string;
  collegeName: string;
  author: string;
  createdAt: string;
  answers: DiscussionAnswer[];
}

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(dbPath)) {
      // Create empty db structures if not present
      const emptyDb: DatabaseSchema = { colleges: [], users: [], savedColleges: [], discussions: [] };
      fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2), "utf-8");
      return emptyDb;
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    const parsed = JSON.parse(data);
    return {
      colleges: parsed.colleges || [],
      users: parsed.users || [],
      savedColleges: parsed.savedColleges || [],
      discussions: parsed.discussions || [],
    };
  } catch (err) {
    console.error("Error reading database file:", err);
    return { colleges: [], users: [], savedColleges: [], discussions: [] };
  }
}

function writeDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

function makeId(prefix: string) {
  return `${prefix}_` + Math.random().toString(36).substring(2, 9);
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Fetch colleges with search and filters
app.get("/api/colleges", (req, res) => {
  const db = readDB();
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const location = typeof req.query.location === "string" ? req.query.location : "";
  const minFees = parseInt(req.query.minFees as string) || 0;
  const maxFees = parseInt(req.query.maxFees as string) || 1000000;
  const rating = parseFloat(req.query.rating as string) || 0;
  const type = req.query.type as string; // 'Public' | 'Private' | ''
  const sortBy = req.query.sortBy as string || "rating-desc"; // rating-desc, fees-asc, fees-desc, placements-desc
  // Improved search: case-insensitive, partial, multi-word, initials (e.g. 'cs' -> 'computer science')
  let filtered = db.colleges.filter((c) => {
    // 1. Search matching using reusable utility
    const matchesSearch = collegeMatchesSearch(
      {
        name: c.name,
        slug: c.slug,
        location: c.location,
        state: c.state,
        description: c.description,
        courses: c.courses,
      },
      search
    );

    // 2. Location filter (separate explicit location filter if provided)
    const matchesLocation = !location || (c.location || "").toLowerCase().includes(location.toLowerCase()) || (c.state || "").toLowerCase().includes(location.toLowerCase());

    // 3. Fees range
    const matchesFees = typeof c.fees === 'number' ? c.fees >= minFees && c.fees <= maxFees : true;

    // 4. Min Rating
    const matchesRating = typeof c.rating === 'number' ? c.rating >= rating : true;

    // 5. College Type (Public/Private)
    const matchesType = !type || (c.type || "").toLowerCase() === type.toLowerCase();

    return matchesSearch && matchesLocation && matchesFees && matchesRating && matchesType;
  });

  // 6. Sorting
  if (sortBy === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "fees-asc") {
    filtered.sort((a, b) => a.fees - b.fees);
  } else if (sortBy === "fees-desc") {
    filtered.sort((a, b) => b.fees - a.fees);
  } else if (sortBy === "placements-desc") {
    // placements format: "31.2 LPA"
    const getLpaValue = (pStr: string) => {
      const parsed = parseFloat(pStr.replace(/[^\d.]/g, "")) || 0;
      return parsed;
    };
    filtered.sort((a, b) => getLpaValue(b.placements) - getLpaValue(a.placements));
  } else if (sortBy === "reviews-desc") {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  res.json({ colleges: filtered });
});

// 3. Get individual college details by slug
app.get("/api/colleges/:slug", (req, res) => {
  const db = readDB();
  const college = db.colleges.find((c) => c.slug === req.params.slug);
  if (!college) {
    return res.status(404).json({ error: "College not found" });
  }
  res.json({ college });
});

// 4. Compare colleges
app.get("/api/compare", (req, res) => {
  const db = readDB();
  const slugsStr = req.query.slugs as string;
  if (!slugsStr) {
    return res.status(400).json({ error: "No college slugs provided for comparison" });
  }

  const slugs = slugsStr.split(",").filter(Boolean);
  const matchedColleges = db.colleges.filter((c) => slugs.includes(c.slug));

  res.json({ colleges: matchedColleges });
});

// 5. User Authentication: Signup
app.post("/api/auth/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = readDB();
  const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User already exists with this email address" });
  }

  // Create user
  const newUser = {
    id: "usr_" + Math.random().toString(36).substring(2, 9),
    email: email.toLowerCase(),
    password: password, // In production, hash passwords. For MVP sandbox, store verified.
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({
    user: { id: newUser.id, email: newUser.email },
    token: newUser.id, // lightweight token identifier
  });
});

// 6. User Authentication: Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = readDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    user: { id: user.id, email: user.email },
    token: user.id,
  });
});

// 7. Get current user session
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const db = readDB();
  const user = db.users.find((u) => u.id === token);

  if (!user) {
    return res.status(401).json({ error: "Invalid session token" });
  }

  res.json({ user: { id: user.id, email: user.email } });
});

// 8. Get current user's saved colleges
app.get("/api/saved-colleges", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const userId = authHeader.replace("Bearer ", "").trim();
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Invalid session token" });
  }

  // Get saved records
  const savedLinks = db.savedColleges.filter((sc) => sc.userId === userId);
  const savedIds = savedLinks.map((s) => s.collegeId);
  
  // Hydrate with college objects
  const savedColleges = db.colleges.filter((c) => savedIds.includes(c.id));

  res.json({ savedColleges, savedIds });
});

// 10. Discussion browsing and Q&A
app.get("/api/discussions", (req, res) => {
  const db = readDB();
  const collegeSlug = typeof req.query.collegeSlug === "string" ? req.query.collegeSlug : "";
  const search = typeof req.query.search === "string" ? req.query.search.toLowerCase() : "";

  const discussions = db.discussions
    .filter((thread) => !collegeSlug || thread.collegeSlug === collegeSlug)
    .filter((thread) => {
      if (!search) return true;
      return (
        thread.title.toLowerCase().includes(search) ||
        thread.body.toLowerCase().includes(search) ||
        thread.collegeName.toLowerCase().includes(search) ||
        thread.answers.some((answer) => answer.body.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json({ discussions });
});

app.post("/api/discussions", (req, res) => {
  const { title, body, collegeSlug, collegeName, author } = req.body;
  if (!title || !body || !collegeSlug || !collegeName) {
    return res.status(400).json({ error: "Title, body, and college are required" });
  }

  const db = readDB();
  const newThread: DiscussionThread = {
    id: makeId("dsc"),
    title,
    body,
    collegeSlug,
    collegeName,
    author: author || "Anonymous",
    createdAt: new Date().toISOString(),
    answers: [],
  };

  db.discussions.push(newThread);
  writeDB(db);
  res.status(201).json({ discussion: newThread });
});

app.post("/api/discussions/:id/answers", (req, res) => {
  const { body, author } = req.body;
  if (!body) {
    return res.status(400).json({ error: "Answer body is required" });
  }

  const db = readDB();
  const thread = db.discussions.find((item) => item.id === req.params.id);
  if (!thread) {
    return res.status(404).json({ error: "Discussion thread not found" });
  }

  const answer: DiscussionAnswer = {
    id: makeId("ans"),
    author: author || "Anonymous",
    body,
    createdAt: new Date().toISOString(),
  };

  thread.answers.push(answer);
  writeDB(db);
  res.status(201).json({ answer, discussion: thread });
});

// 9. Save/Unsave (toggle) a college
app.post("/api/saved-colleges/toggle", (req, res) => {
  const authHeader = req.headers.authorization;
  const { collegeId } = req.body;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }
  if (!collegeId) {
    return res.status(400).json({ error: "College ID is required" });
  }

  const userId = authHeader.replace("Bearer ", "").trim();
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Invalid session token" });
  }

  const existingIndex = db.savedColleges.findIndex(
    (sc) => sc.userId === userId && sc.collegeId === collegeId
  );

  let isSaved = false;
  if (existingIndex >= 0) {
    // Remove it
    db.savedColleges.splice(existingIndex, 1);
  } else {
    // Add it
    db.savedColleges.push({
      id: "sav_" + Math.random().toString(36).substring(2, 9),
      userId,
      collegeId,
      createdAt: new Date().toISOString(),
    });
    isSaved = true;
  }

  writeDB(db);

  // Return updated list of saved college IDs for easy synchronisation
  const updatedSavedIds = db.savedColleges
    .filter((sc) => sc.userId === userId)
    .map((s) => s.collegeId);

  res.json({ saved: isSaved, savedIds: updatedSavedIds });
});

// ==========================================
// VITE OR STATIC SERVING MIDDLEWARE
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded connected to Express");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files server configured");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Full-stack server active at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Express startup failed:", err);
});
