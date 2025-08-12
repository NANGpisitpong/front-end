import type { SVGProps } from 'react';
import { createElement } from 'react';

export type NavItem = {
  label: string;
  href: string;
  color?: 'success' | 'info' | 'danger' | 'warning' | 'primary' | 'secondary';
  external?: boolean;
};

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/Home', color: 'success' },
  { label: 'About', href: '/about', color: 'info' },
  { label: 'Service', href: '/service', color: 'danger' },
];

export const contactNav: NavItem[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/', external: true },
  { label: 'Line', href: 'https://www.line.me/en/', external: true },
];

export const Icons = {
  Sun: (props: SVGProps<SVGSVGElement>) =>
    createElement(
      'svg',
      { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2, ...props },
      createElement('circle', { cx: 12, cy: 12, r: 4 }),
      createElement('path', {
        d: 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41',
      }),
    ),
  Moon: (props: SVGProps<SVGSVGElement>) =>
    createElement(
      'svg',
      { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2, ...props },
      createElement('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }),
    ),
};
