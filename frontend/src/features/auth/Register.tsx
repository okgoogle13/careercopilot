import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { KeralaRageButton } from '../../components/ui/KeralaRageButton';
import { useAuth } from '../../context/AuthContext';
import { useUserStore } from '@/stores/userStore';

// KeralaRage Assets
const KrMotifGrid =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const paperWhiteGrid =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function Register() {
  const [authError, setAuthError] = useState('');
  const { register: registerAuth } = useAuth();
  const setIsNewUser = useUserStore((state) => state.setIsNewUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setAuthError('');
    try {
      await registerAuth(data.email, data.password, data.displayName);
      setIsNewUser(true);
      navigate('/welcome');
    } catch (err: any) {
      console.error('Registration error:', err);
      setAuthError(err?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-asphalt-black-darkest flex items-center justify-center p-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Atmosphere Layer */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${paperWhiteGrid})`, backgroundRepeat: 'repeat' }}
      />

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-concrete-grey/80 backdrop-blur-xl rounded-megaphone p-10 border border-concrete-grey/10 shadow-maximum relative"
        >
          {/* KrMotif Decoration */}
          <div className="absolute top-[-40px] left-[-40px] w-32 h-32 opacity-20 pointer-events-none transform rotate-180">
            <img
              src={KrMotifGrid}
              alt=""
              className="animate-spin-slow"
              style={{ animationDuration: '80s' }}
            />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-[clamp(2.5rem,6.2vw,4rem)] leading-[0.95] font-black text-ink-gold mb-2 uppercase tracking-tight break-words">
              Create Account
            </h1>
            <p className="text-micro font-light text-concrete-grey opacity-[0.8] uppercase tracking-widest leading-none">
              Start your CareerCopilot workspace
            </p>
          </div>

          {authError && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-8 p-4 rounded-pebble bg-solidarity-red/20 text-solidarity-red border border-solidarity-red/30 font-mono text-xs"
            >
              {authError}
            </motion.div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="group">
              <label
                htmlFor="displayName"
                className="block text-micro font-light text-ink-gold mb-2 font-mono tracking-widest uppercase"
              >
                Full Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Jane Doe"
                className="w-full px-6 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-megaphone h-12 focus:outline-none focus:border-ink-gold transition-all font-primary"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-solidarity-red text-[10px] mt-1 font-mono uppercase">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block text-micro font-light text-ink-gold mb-2 font-mono tracking-widest uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-6 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-megaphone h-12 focus:outline-none focus:border-ink-gold transition-all font-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-solidarity-red text-[10px] mt-1 font-mono uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="group flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="password"
                  title="Password"
                  className="block text-micro font-light text-ink-gold mb-2 font-mono tracking-widest uppercase overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-megaphone h-12 focus:outline-none focus:border-ink-gold transition-all font-primary"
                  {...register('password')}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="confirmPassword"
                  title="Confirm Password"
                  className="block text-micro font-light text-ink-gold mb-2 font-mono tracking-widest uppercase overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-megaphone h-12 focus:outline-none focus:border-ink-gold transition-all font-primary"
                  {...register('confirmPassword')}
                />
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-solidarity-red text-[10px] font-mono uppercase">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            <KeralaRageButton
              variant="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </KeralaRageButton>
          </form>

          <div className="text-center mt-10 pt-6 border-t border-concrete-grey/10">
            <Link
              to="/login"
              className="text-curator-accent text-sm text-concrete-grey hover:text-ink-gold transition-colors"
            >
              Already have an account? Sign in.
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
