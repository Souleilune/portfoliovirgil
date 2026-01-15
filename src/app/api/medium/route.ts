import { NextRequest, NextResponse } from 'next/server';

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  description?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  // Remove @ symbol if present
  const cleanUsername = username.replace('@', '');
  const rssUrl = `https://medium.com/feed/@${cleanUsername}`;

  try {
    // Fetch the RSS feed
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();

    // Parse XML to extract articles
    const articles = parseRSSFeed(xmlText);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles. Please check the username and try again.' },
      { status: 500 }
    );
  }
}

function parseRSSFeed(xmlText: string): MediumArticle[] {
  const articles: MediumArticle[] = [];
  
  // Simple XML parsing using regex (for basic RSS structure)
  // This is a simplified parser - for production, consider using a proper XML parser
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    
    const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
    const authorMatch = itemContent.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>|<dc:creator>(.*?)<\/dc:creator>|<author>(.*?)<\/author>/);
    const descriptionMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);

    if (titleMatch && linkMatch && pubDateMatch) {
      const title = titleMatch[1] || titleMatch[2] || '';
      const link = linkMatch[1] || '';
      const pubDate = pubDateMatch[1] || '';
      const author = authorMatch ? (authorMatch[1] || authorMatch[2] || authorMatch[3] || '') : '';
      const description = descriptionMatch ? (descriptionMatch[1] || descriptionMatch[2] || '') : '';

      articles.push({
        title: title.trim(),
        link: link.trim(),
        pubDate: pubDate.trim(),
        author: author.trim() || 'Unknown',
        description: description.trim(),
      });
    }
  }

  // Limit to 12 most recent articles
  return articles.slice(0, 12);
}



