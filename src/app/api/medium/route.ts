import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");


  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  console.log(ip)

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    // Use RSS2JSON service to bypass CORS and Medium's blocking
    const rssUrl = `https://medium.com/feed/@${username}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      rssUrl
    )}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 43200 }, // 12 hours in seconds
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("RSS feed returned error status");
    }

    // Transform the data to extract thumbnails from content
    const items = data.items.map((item: any) => {
      // Extract first image from description/content
      const imgMatch = item.description?.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch?.[1] || item.thumbnail || "";

      // Clean description
      const cleanDescription = item.description
        ? item.description
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim()
          .slice(0, 200)
        : "";

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: cleanDescription,
        thumbnail,
        categories: item.categories || [],
      };
    });

    return NextResponse.json(
      {
        status: "ok",
        items,
        count: items.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error("RSS fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Medium articles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
