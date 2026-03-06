import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { LoginCard, type LoginCredentials } from '@/components/LoginCard';
import { useAuth } from '@/context/AuthContext';

// KeralaRage Assets
const KrMotifGrid =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const paperWhiteGrid =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function Login() {
  const [authError, setAuthError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
      navigate('/onboarding'); // Redirect to onboarding first
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(err?.message || 'Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-asphalt-black-darkest flex items-center justify-center p-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Atmosphere Layer */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${paperWhiteGrid})`, backgroundRepeat: 'repeat' }}
      />

      <div className="relative z-10">
        <LoginCard
          onLogin={(credentials: LoginCredentials) => {
            const values: LoginValues = {
              email: credentials.email,
              password: credentials.password ?? '',
            };
            void onSubmit(values);
          }}
          onRegisterClick={() => navigate('/register')}
          isLoading={isSubmitting}
        />

        {authError && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 p-4 rounded-pebble bg-solidarity-red/10 text-solidarity-red border border-solidarity-red/20 text-center font-jetbrains-mono text-xs uppercase"
          >
            Verification Fault: {authError}
          </motion.div>
        )}
      </div>
    </div>
  );
}
