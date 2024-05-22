import { ProductExtractor } from "@/lib/ProductExtractor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {

    if (request.nextUrl.searchParams.get("product") === null)
        return Response.json({ error: "No product specified" }, { status: 400 })


    try {
        const buffer = await new ProductExtractor().parse(parseInt(request.nextUrl.searchParams.get("product")!));

        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename=${request.nextUrl.searchParams.get("product")}.chkn`
            }
        })
    } catch (e) {
        return Response.json({ error: "No product found" }, { status: 400 })
    }
}