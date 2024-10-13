import { MongoClient } from "mongodb";

// Función para conectarse a MongoDB
async function connectToMongoDB() {
  const uri =
    "mongodb+srv://arieldg1997:0PQKp1lfi0pqNkDh@fifty-fifty-cluster.0gncl.mongodb.net/?retryWrites=true&w=majority&appName=fifty-fifty-cluster";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("fifty-fifty");
    return db.collection("expenses");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
// Handler para GET
export async function GET(request) {
  try {
    const collection = await connectToMongoDB();
    const expenses = await collection.find({}).sort({ date: -1 }).toArray();
    return new Response(JSON.stringify(expenses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return new Response(JSON.stringify({ error: "Error fetching expenses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handler para POST
export async function POST(request) {
  try {
    const collection = await connectToMongoDB();
    const body = await request.json();
    const result = await collection.insertOne(body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return new Response(JSON.stringify({ error: "Error adding expense" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request) {
  try {
    const collection = await connectToMongoDB();
    const { id } = await request.json(); // Asumiendo que el cuerpo de la petición contiene un JSON con el id del gasto a eliminar
    await collection.deleteOne({ id });
    return new Response("Expense deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return new Response(JSON.stringify({ error: "Error deleting expense" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
