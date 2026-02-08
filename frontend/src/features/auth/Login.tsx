import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { KeralaRageButton } from '../../components/ui/KeralaRageButton';
import { useAuth } from '../../context/AuthContext';

// KeralaRage Assets
import KrMotifGrid from '../../assets/KrMotifs/leaf-fern.png'; // Using available KrMotif
import paperWhiteGrid from '../../assets/textures/paper-grain.png'; // Using available texture

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

      <div className="w-full max-w-md relative z-10">
        {/* The Entry Gate (KrDark Glass) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-concrete-grey/80 backdrop-blur-xl rounded-stone p-10 border border-concrete-grey/10 shadow-maximum overflow-hidden relative"
        >
          {/* Compass Motif Decoration */}
          <div className="absolute top-[-40px] right-[-40px] w-32 h-32 opacity-20 pointer-events-none">
            <img
              src={KrMotifGrid}
              alt=""
              className="animate-spin-slow"
              style={{ animationDuration: '60s' }}
            />
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-6xl text-bloom-ultra text-wattle-gold mb-2">Entry Gate</h1>
            <p className="text-curator-accent text-concrete-grey opacity-70">
              Begin your botanical assessment
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-8 p-4 rounded-pebble bg-waratah-red/20 text-waratah-red border border-waratah-red/30 font-annotation text-xs"
            >
              ⚠️ [FAILED_AUTH]: {authError}
            </motion.div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            <div className="group">
              <label
                htmlFor="email"
                className="block text-xs text-wattle-gold mb-3 font-annotation tracking-widest uppercase"
              >
                Field Investigator ID (Email)
              </label>
              <input
                id="email"
                type="email"
                placeholder="investigator@station.net"
                className="w-full px-6 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-stone h-14 focus:outline-none focus:border-wattle-gold focus:ring-1 focus:ring-wattle-gold transition-all duration-300 font-field-note"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-waratah-red text-[10px] mt-2 font-annotation uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-xs text-wattle-gold mb-3 font-annotation tracking-widest uppercase"
              >
                Access Keychain (Password)
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-6 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-stone h-14 focus:outline-none focus:border-wattle-gold focus:ring-1 focus:ring-wattle-gold transition-all duration-300 font-field-note"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-waratah-red text-[10px] mt-2 font-annotation uppercase">
                  {errors.password.message}
                </p>
              )}
            </div>

            <KeralaRageButton
              variant="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4"
            >
              {isSubmitting ? 'Validating...' : 'Authenticate'}
            </KeralaRageButton>
          </form>

          {/* Helper Links */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-concrete-grey/10">
            <Link
              to="/register"
              className="text-curator-accent text-sm text-concrete-grey hover:text-wattle-gold transition-colors"
            >
              New Prospect? Register.
            </Link>
            <button
              onClick={() => navigate('/dashboard?demo=true')}
              className="text-annotation text-[9px] text-concrete-grey/40 hover:text-concrete-grey uppercase tracking-tighter"
            >
              Guest Clearance
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
