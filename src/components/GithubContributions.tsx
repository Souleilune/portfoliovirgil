"use client";

import { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

const GITHUB_USERNAME = 'Souleilune';

const levelClasses = [
  'bg-black/[0.05] dark:bg-white/[0.06]',
  'bg-black/25 dark:bg-white/25',
  'bg-black/45 dark:bg-white/45',
  'bg-black/65 dark:bg-white/65',
  'bg-black/85 dark:bg-white/85',
];

function buildWeeks(days: ContributionDay[]) {
  if (days.length === 0) return [];

  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  const firstDay = new Date(`${days[0].date}T00:00:00`);
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', count: -1, level: -1 });
  }

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: -1, level: -1 });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export default function GithubContributions() {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(`/api/github-contributions?username=${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json: ContributionsResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (error) return null;

  const weeks = data ? buildWeeks(data.contributions) : [];

  return (
    <div className="mb-4 sm:mb-5 w-full flex flex-col items-center">
      {loading ? (
        <div className="h-[80px] flex items-center justify-center text-xs text-black/30 dark:text-white/30 font-light">
          Loading contributions...
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide max-w-full flex justify-center">
          <div className="flex gap-[2px] w-max">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={
                      day.date
                        ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`
                        : undefined
                    }
                    className={`w-[10px] h-[10px] sm:w-[17px] sm:h-[17px] rounded-[3px] ${
                      day.level >= 0 ? levelClasses[day.level] : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-black/35 dark:text-white/35 font-light">
        <span>Less</span>
        {levelClasses.map((cls, i) => (
          <span key={i} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[1px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}