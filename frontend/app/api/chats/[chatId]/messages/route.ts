import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { URLS } from "@/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const { chatId } = await params;
    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // DEBUG: See exactly what URL is being called
    const url = URLS.GET_CHAT_MESSAGES(chatId);
    console.log("🔍 chatId:", chatId);
    console.log("🔍 Calling Django URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("🔍 Django response status:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log("🔍 Django error body:", errorBody);
      return NextResponse.json(
        { error: `Error: ${response.status}`, url, body: errorBody },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("✅ Messages from Django:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
