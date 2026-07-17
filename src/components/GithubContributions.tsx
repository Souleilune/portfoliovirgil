"use client";

import { useEffect, useState } from 'react';
import { Github, GitCommitHorizontal } from 'lucide-react';

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
  const totalThisYear = data
    ? Object.values(data.total).reduce((sum, n) => sum + n, 0)
    : 0;

  return (
    <div className="mb-16 sm:mb-20 max-w-6xl mx-auto flex flex-col items-center">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 mb-8 sm:mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2">
          {/* <Github className="w-4 h-4 text-black/40 dark:text-white/40" /> */}
          {/* <h3 className="text-xs sm:text-sm text-black/40 dark:text-white/40 font-medium uppercase tracking-wider">
            GitHub Contributions
          </h3> */}
        </div>
        {/* {!loading && data && (
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-black/45 dark:text-white/45 font-light sm:before:content-['·'] sm:before:mr-2 sm:before:text-black/25 dark:sm:before:text-white/25">
            <GitCommitHorizontal className="w-4 h-4 text-black/30 dark:text-white/30" />
            <span>{totalThisYear.toLocaleString()} contributions in the last year</span>
          </div>
        )} */}
      </div>

      {loading ? (
        <div className="h-[110px] flex items-center justify-center text-sm text-black/30 dark:text-white/30 font-light">
          Loading contributions...
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide max-w-full flex justify-center">
          <div className="flex gap-[2px] w-max">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={
                      day.date
                        ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`
                        : undefined
                    }
                    className={`w-[10px] h-[10px] sm:w-4 sm:h-4 rounded-[2px] ${
                      day.level >= 0 ? levelClasses[day.level] : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-black/35 dark:text-white/35 font-light">
        <span>Less</span>
        {levelClasses.map((cls, i) => (
          <span key={i} className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}