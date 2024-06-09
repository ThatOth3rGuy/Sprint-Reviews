import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../../app/src/pages/index';
import { describe, it } from 'node:test';
// Import Jest types for TypeScript
import { expect } from '@jest/globals';


/*describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading: HTMLElement = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeDefined();
  });
});
*/