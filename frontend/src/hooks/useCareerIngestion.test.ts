import { jest } from '@jest/globals';

// Mock AuthContext
const mockUseAuth = jest.fn();
(jest as any).unstable_mockModule('@/context/AuthContext', () => ({
    useAuth: mockUseAuth,
}));

const mockSession = { access_token: 'test-token', user: { email: 'test@example.com' } };

import React from 'react';
import { renderHook, act } from '@testing-library/react';

// Mock global fetch
global.fetch = jest.fn();

const mockCareerData = {
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

describe('useCareerIngestion', () => {
    let useCareerIngestion: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            session: mockSession,
            user: mockSession.user,
            loading: false,
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
        });

        // Dynamic import to ensure mock is applied
        const module = await import('./useCareerIngestion');
        useCareerIngestion = module.useCareerIngestion;
    });

    it('updateCareerDatabase calls correct endpoint with PATCH and data', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCareerData,
        });

        const { result } = renderHook(() => useCareerIngestion());

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
        // mockSession already has token
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCareerData,
        });

        const { result } = renderHook(() => useCareerIngestion());
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

        expect(global.fetch).toHaveBeenCalledWith('/api/v1/ingest', expect.objectContaining({
            method: 'POST',
            headers: {
                'Authorization': 'Bearer test-token',
            },
        }));

        const callArgs = (global.fetch as jest.Mock).mock.calls[0];
        expect(callArgs[1].body).toBeInstanceOf(FormData);
    });

    it('handles errors correctly', async () => {
        // mockSession already has token
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: async () => 'Internal Server Error',
            statusText: 'Internal Server Error'
        });

        const { result } = renderHook(() => useCareerIngestion());

        await act(async () => {
            try {
                await result.current.updateCareerDatabase(mockCareerData);
            } catch {
                // Expected error
            }
        });

        expect(result.current.error).toContain('Internal Server Error');
    });
});
