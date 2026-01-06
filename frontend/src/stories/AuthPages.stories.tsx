import type { Meta, StoryObj } from '@storybook/react';
import { Login } from '../features/auth/Login';
import { Register } from '../features/auth/Register';

const loginMeta: Meta<typeof Login> = {
    title: 'Auth/Login',
    component: Login,
    parameters: {
        layout: 'fullscreen',
    },
};

export default loginMeta;

export const LoginPage: StoryObj<typeof Login> = {};

export const RegisterPage: StoryObj<typeof Register> = {
    render: () => <Register />,
};

export const MobileLogin: StoryObj<typeof Login> = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
