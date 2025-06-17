import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "src", "app", "data", "users.json");

function readUsers() {
  try {
    const fileContents = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing users file:", error);
    return false;
  }
}

export async function GET() {
  try {
    const users = readUsers();
    return Response.json(users, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, role } = await request.json();

    // Validation
    if (!name || !email || !role) {
      return Response.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const currentUsers = readUsers();

    // Check for duplicate email
    if (
      currentUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      id: Math.max(...currentUsers.map((u) => u.id), 0) + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    };

    const updatedUsers = [...currentUsers, newUser];

    if (writeUsers(updatedUsers)) {
      return Response.json(newUser, { status: 201 });
    } else {
      return Response.json(
        { error: "Failed to save user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
