import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.MONGODB_DB || "fintech";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  const clientOptions = {
    serverApi: ServerApiVersion.v1,
    tls: true,
    appName: "fintech-dashboard",
    retryWrites: true,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    minPoolSize: 1,
    maxPoolSize: 5,
  };

  if (process.env.MONGODB_TLS_INSECURE === "true") {
    clientOptions.tlsAllowInvalidCertificates = true;
    clientOptions.tlsAllowInvalidHostnames = true;
  }

  client = new MongoClient(MONGODB_URI, clientOptions);
  clientPromise = client.connect().catch((error) => {
    console.error("MongoDB connection failed:", error);
    throw error;
  });
  global._mongoClientPromise = clientPromise;
} else {
  clientPromise = global._mongoClientPromise;
}

async function getDb() {
  const conn = await clientPromise;
  return conn.db(DB_NAME);
}

export async function getAllTransactions(userId) {
  const db = await getDb();
  const docs = await db.collection("transactions").find({ userId }).sort({ date: -1 }).toArray();
  return docs.map((d) => {
    const { _id, userId: uid, ...rest } = d;
    return { id: _id.toString(), ...rest };
  });
}

export async function addTransaction(transaction, userId) {
  const db = await getDb();
  const doc = {
    ...transaction,
    userId,
    createdAt: new Date(),
  };
  const res = await db.collection("transactions").insertOne(doc);
  return { id: res.insertedId.toString(), ...doc };
}

export async function deleteTransaction(id, userId) {
  const db = await getDb();
  const res = await db
    .collection("transactions")
    .deleteOne({ _id: new ObjectId(id), userId });
  return res.deletedCount > 0;
}

export async function createUser({ email, passwordHash }) {
  const db = await getDb();
  const existing = await db.collection("users").findOne({ email });
  if (existing) return null;
  const res = await db.collection("users").insertOne({ email, passwordHash, createdAt: new Date() });
  return { id: res.insertedId.toString(), email };
}

export async function findUserByEmail(email) {
  const db = await getDb();
  return db.collection("users").findOne({ email });
}

export async function findUserById(id) {
  const db = await getDb();
  return db.collection("users").findOne({ _id: new ObjectId(id) });
}
