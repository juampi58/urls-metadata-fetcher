import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import DataCard from './DataCard'; 

describe('DataCard Component', () => {
  const item = {
    title: 'Test Title',
    description: 'This is a test description.',
    image: 'https://via.placeholder.com/150'
  };

  test('renders the title, description, and image correctly', () => {
    render(<DataCard item={item} />);

    expect(screen.getByText(item.title)).toBeInTheDocument();

    expect(screen.getByText(item.description)).toBeInTheDocument();

    const imageElement = screen.getByAltText(item.title);
    expect(imageElement).toHaveAttribute('src', item.image);
  });

  test('renders the image with the correct alt text', () => {
    render(<DataCard item={item} />);
    
    const imageElement = screen.getByAltText(item.title);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('alt', item.title);
  });
});
