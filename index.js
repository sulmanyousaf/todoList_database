const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.json());

const dataFilePath = path.join(__dirname, "tasks.json");

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await readTasksFromFile();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const tasks = await readTasksFromFile();
    const newTasks = req.body.map((task) => ({
      id: uuidv4(),
      ...task,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await writeTasksToFile(newTasks);
    res.json(newTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function readTasksFromFile() {
  try {
    const content = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writeTasksToFile(tasks) {
  await fs.writeFile(dataFilePath, JSON.stringify(tasks, null, 2));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
