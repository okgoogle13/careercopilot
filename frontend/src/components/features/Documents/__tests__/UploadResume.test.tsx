import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadResume } from '../UploadResume';

describe('UploadResume', () => {
  it('should render the component', () => {
    render(<UploadResume onNext={() => {}} onBack={() => {}} />);
    expect(screen.getByText('Create Your Master Profile')).toBeInTheDocument();
  });

  it('should render the back and continue buttons', () => {
    render(<UploadResume onNext={() => {}} onBack={() => {}} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Continue to Profile Creation')).toBeInTheDocument();
  });

  it('should call onNext when the continue button is clicked', () => {
    const onNext = jest.fn();
    render(<UploadResume onNext={onNext} onBack={() => {}} />);
    fireEvent.click(screen.getByText('Continue to Profile Creation'));
    expect(onNext).toHaveBeenCalled();
  });

  it('should call onBack when the back button is clicked', () => {
    const onBack = jest.fn();
    render(<UploadResume onNext={() => {}} onBack={onBack} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('should render the three upload areas', () => {
    render(<UploadResume onNext={() => {}} onBack={() => {}} />);
    expect(screen.getByText('Resumes')).toBeInTheDocument();
    expect(screen.getByText('Cover Letters')).toBeInTheDocument();
    expect(screen.getByText('Selection Criteria Responses')).toBeInTheDocument();
  });
});
