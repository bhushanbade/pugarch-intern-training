import type { SVGProps } from 'react';

const paths: Record<string, string> = {
  dashboard: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
  facilities: 'M3 21h18M5 21V7l7-4 7 4v14M9 10h1m4 0h1m-6 4h1m4 0h1m-5 7v-4h4v4',
  inspections: 'm5 12 4 4L19 6',
  complaints: 'M12 8v4m0 4h.01M10.3 3.9 1.8 18.5A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z',
  employees: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7.5a4 4 0 0 1 0 7.7m2 3.3a4 4 0 0 1 2 3.5V21',
  performance: 'M3 3v18h18M8 15l4-4 4 3 5-7',
  search: 'm20 20-4.2-4.2M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0',
  chevron: 'm7 10 5 5 5-5',
  building: 'M3 21h18M5 21V5h14v16M9 9h2m2 0h2m-6 4h2m2 0h2m-6 4h2m2 0h2',
  clipboard: 'M9 5H5v16h14V5h-4M9 3h6v4H9zM8 12h8m-8 4h8',
  alert: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18.5A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z',
};

export function Icon({ name, size = 18, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths; size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24" width={size} {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
