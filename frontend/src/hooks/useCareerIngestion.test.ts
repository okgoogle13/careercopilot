import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCareerIngestion } from './useCareerIngestion';
import { CareerDatabase } from '../types/api';
import { AuthContext } from '../context/AuthContext';

// Mock global fetch
global.fetch = jest.fn();

const mockCareerData: CareerDatabase = {
    Personal_Information: {
        FullName: 'John Doe',
        Phone: '123-456-7890',
        Email: 'john@example.com',
        Location: 'San Francisco, CA',
        Portfolio_Website_URLs: []
    },
    Career_Profile: {
        Target_Titles: ['Software Engineer'],
        Master_Summary_Points: []
    },
    Master_Skills_Inventory: [],
    Career_Entries: [],
    Structured_Achievements: [],
    KSC_Responses: []
};

// Create a wrapper component
const mockGetIdToken = jest.fn();
const mockUser = { getIdToken: mockGetIdToken };
const mockContextValue = {
    user: mockUser,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
} as any;

// Use React.createElement to avoid potential JSX parsing issues if configuration is strict
const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(AuthContext.Provider, { value: mockContextValue }, children);

describe('useCareerIngestion', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('updateCareerDatabase calls correct endpoint with PATCH and data', async () => {
        mockGetIdToken.mockResolvedValue('test-token');
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCareerData,
        });

        const { result } = renderHook(() => useCareerIngestion(), { wrapper });

        await act(async () => {
            await result.current.updateCareerDatabase(mockCareerData);
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/v1/career-database', {
            method: 'PATCH',
            body: JSON.stringify(mockCareerData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token',
            },
        });

        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('submitDocuments calls correct endpoint with POST and files', async () => {
        mockGetIdToken.mockResolvedValue('test-token');
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCareerData,
        });

        const { result } = renderHook(() => useCareerIngestion(), { wrapper });
        const files = [new File([''], 'test.pdf', { type: 'application/pdf' })];

        await act(async () => {
            await result.current.submitDocuments(files);
        });

        expect(global.fetch).toHaveBeenCalledWith('/api/v1/ingest', expect.objectContaining({
            method: 'POST',
            headers: {
                'Authorization': 'Bearer test-token',
            },
        }));

        const callArgs = (global.fetch as jest.Mock).mock.calls[0];
        expect(callArgs[0]).toBe('/api/v1/ingest');
        expect(callArgs[1].body).toBeInstanceOf(FormData);
    });

    it('handles errors correctly', async () => {
        mockGetIdToken.mockResolvedValue('test-token');
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: async () => 'Internal Server Error',
            statusText: 'Internal Server Error'
        });

        const { result } = renderHook(() => useCareerIngestion(), { wrapper });

        await act(async () => {
            try {
                await result.current.updateCareerDatabase(mockCareerData);
            } catch (e) {
                // Expected error
            }
        });

        expect(result.current.error).toContain('Internal Server Error');
    });
});
