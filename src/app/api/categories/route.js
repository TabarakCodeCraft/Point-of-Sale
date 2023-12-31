import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    let categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch categories" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


export async function POST(req) {
  const body = await req.json();
  try {
    let category = await prisma.category.create({
      data: body,
    });
    return Response.json({
      success: true,
      category,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
};
