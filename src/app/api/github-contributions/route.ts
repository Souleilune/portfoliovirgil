import { NextRequest, NextResponse } from 'next/server';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
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

  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub contributions: ${response.status}`);
    }

    const data: ContributionsResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions. Please check the username and try again.' },
      { status: 500 }
    );
  }
}