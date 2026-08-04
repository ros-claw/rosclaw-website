import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const target = new URL("/get?channel=main", request.url);
  return NextResponse.redirect(target, 307);
}
