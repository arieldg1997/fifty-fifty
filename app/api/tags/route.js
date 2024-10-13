import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://arieldg1997:0PQKp1lfi0pqNkDh@fifty-fifty-cluster.0gncl.mongodb.net/?retryWrites=true&w=majority&appName=fifty-fifty-cluster";
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    return client.db("fifty-fifty").collection("tags");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// GET all tags
export async function GET(request) {
  const tagsCollection = await connectToMongoDB();
  const tags = await tagsCollection.find({}).toArray();
  return new Response(JSON.stringify(tags), { status: 200 });
}

// POST a new tag
export async function POST(request) {
  const tagsCollection = await connectToMongoDB();
  const newTag = await request.json(); // Asumiendo que el cuerpo de la petición contiene un JSON con el nuevo tag
  await tagsCollection.insertOne({ name: newTag.name, createdAt: new Date() });
  return new Response("Tag created", { status: 201 });
}

// DELETE a tag by name
export async function DELETE(request) {
  const tagsCollection = await connectToMongoDB();
  const { name } = await request.json(); // Asumiendo que el cuerpo de la petición contiene un JSON con el nombre del tag a eliminar
  await tagsCollection.deleteOne({ name });
  return new Response("Tag deleted", { status: 200 });
}
