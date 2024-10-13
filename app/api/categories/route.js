import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://arieldg1997:0PQKp1lfi0pqNkDh@fifty-fifty-cluster.0gncl.mongodb.net/?retryWrites=true&w=majority&appName=fifty-fifty-cluster";
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    return client.db("fifty-fifty").collection("categories");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// GET all categories
export async function GET(request) {
  const categoriesCollection = await connectToMongoDB();
  const categories = await categoriesCollection.find({}).toArray();
  return new Response(JSON.stringify(categories), { status: 200 });
}

// POST a new categories
export async function POST(request) {
  const categoriesCollection = await connectToMongoDB();
  const newCategory = await request.json(); // Asumiendo que el cuerpo de la petición contiene un JSON con el nuevo category
  await categoriesCollection.insertOne({
    name: newCategory.name,
    createdAt: new Date(),
    monthlyObjective: newCategory.monthlyObjective,
  });
  return new Response("Category created", { status: 201 });
}

// DELETE a categories by name
export async function DELETE(request) {
  const categoriesCollection = await connectToMongoDB();
  const { name } = await request.json(); // Asumiendo que el cuerpo de la petición contiene un JSON con el nombre del category a eliminar
  await categoriesCollection.deleteOne({ name });
  return new Response("Category deleted", { status: 200 });
}
