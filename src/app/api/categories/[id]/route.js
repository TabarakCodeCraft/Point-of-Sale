
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedcategory = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });
    return Response.json({
      success: true,
      updatedcategory,
    });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Validation Errors:', error.message);
    } else {
      console.error('Other Error:', error);
    }
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedCategory = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!deletedCategory) {
      return Response.json({
        success: false,
        error: { message: 'Category not found' },
      });
    }
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return Response.json({
      success: true,
      category: deletedCategory,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}