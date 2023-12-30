import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const cat = searchParams.get("cat");

  let products = await prisma.product.findMany(
    cat
      ? {
        where: {
          categoryId: parseInt(cat),
        },
      }
      : {}
  );
return Response.json(products);
}

export async function POST(req) {
  const body = await req.json();
  
  try {
    let product = await prisma.product.create({
      data: body,
    });
    return Response.json({
      success: true,
      product,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}

export async function PUT(req) {
  const { id } = req.body;
  const body = await req.json();

  try {

    const updatedProduct = await prisma.product.update({
      where: {
        id: body.id,
      },
      data: body,
    });
    return Response.json({
      success: true,
      product: updatedProduct,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
};


export async function DELETE(req) {
  const body = await req.json();
  try {
    console.log(body.id);

    const deletedProduct = await prisma.product.delete({
      where: {
        id: body.id,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        product: deletedProduct,
      }),
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      statusCode: error.code === 'P2025' ? 404 : 500, // Assuming P2025 is Prisma's error code for "not found"
      body: JSON.stringify({
        success: false,
        error: error.message || "Internal Server Error",
      }),
    };
  }
}

