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

export async function GET(request, { params }) {
  const userId = parseInt((await params).id);

  if (isNaN(userId)) {
    return Response.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const users = readUsers();
    const user = users.find((u) => u.id === userId);
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    
    return Response.json(user);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const userId = parseInt((await params).id);

  if (isNaN(userId)) {
    return Response.json({ error: "Invalid user ID" }, { status: 400 });
  }

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
    const userIndex = currentUsers.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check for duplicate email (excluding current user)
    if (
      currentUsers.some(
        (user, index) =>
          index !== userIndex &&
          user.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const updatedUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    };

    currentUsers[userIndex] = updatedUser;

    if (writeUsers(currentUsers)) {
      return Response.json(updatedUser);
    } else {
      return Response.json(
        { error: "Failed to update user" },
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

export async function DELETE(request, { params }) {
  const userId = parseInt((await params).id);

  if (isNaN(userId)) {
    return Response.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const usersToUpdate = readUsers();
    const userToDeleteIndex = usersToUpdate.findIndex((u) => u.id === userId);

    if (userToDeleteIndex === -1) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const filteredUsers = usersToUpdate.filter((u) => u.id !== userId);

    if (writeUsers(filteredUsers)) {
      return Response.json({ message: "User deleted successfully" });
    } else {
      return Response.json(
        { error: "Failed to delete user" },
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