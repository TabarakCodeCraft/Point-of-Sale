import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    const { id } = params;
    const body = await req.json();
    console.log('Request Payload:', body);

    body.price = parseInt(body.price);

    try {
        const updatedProduct = await prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: body,
        });

        console.log('Updated Product:', updatedProduct);
        return Response.json({
            success: true,
            updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return Response.json({
            success: false,
            error,
        });
    }
}


export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        const deletedProduct = await prisma.product.delete({
            where: {
                id: parseInt(id),
            },
        });

        return Response.json({
            success: true,
            deletedProduct,
        });
    } catch (error) {
        return Response.json({
            success: false,
            error,
        });
    }
}
