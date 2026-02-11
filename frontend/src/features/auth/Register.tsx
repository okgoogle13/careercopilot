import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { KeralaRageButton } from '../../components/ui/KeralaRageButton';
import { useAuth } from '../../context/AuthContext';

// KeralaRage Assets
import KrMotifGrid from '../../assets/KrMotifs/leaf-fern.png';
import paperWhiteGrid from '../../assets/textures/paper-grain.png';

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
      navigate('/onboarding');
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

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-concrete-grey/80 backdrop-blur-xl rounded-stone p-10 border border-concrete-grey/10 shadow-maximum overflow-hidden relative"
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
            <h1 className="text-6xl text-bloom-ultra text-ink-gold mb-2">New KrMotif</h1>
            <p className="text-curator-accent text-concrete-grey opacity-70">
              Register with the station
            </p>
          </div>

          {authError && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-8 p-4 rounded-pebble bg-solidarity-red/20 text-solidarity-red border border-solidarity-red/30 font-annotation text-xs"
            >
              ⚠️ [FAILED_REG]: {authError}
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
                className="block text-xs text-ink-gold mb-2 font-annotation tracking-widest uppercase"
              >
                Common Name (Display Name)
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Field Investigator Jones"
                className="w-full px-6 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-stone h-12 focus:outline-none focus:border-ink-gold transition-all font-field-note"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-solidarity-red text-[10px] mt-1 font-annotation uppercase">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block text-xs text-ink-gold mb-2 font-annotation tracking-widest uppercase"
              >
                Station ID (Email)
              </label>
              <input
                id="email"
                type="email"
                placeholder="investigator@station.net"
                className="w-full px-6 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-stone h-12 focus:outline-none focus:border-ink-gold transition-all font-field-note"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-solidarity-red text-[10px] mt-1 font-annotation uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="group flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="password"
                  title="Keychain"
                  className="block text-xs text-ink-gold mb-2 font-annotation tracking-widest uppercase overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Keychain
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-stone h-12 focus:outline-none focus:border-ink-gold transition-all font-field-note"
                  {...register('password')}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="confirmPassword"
                  title="Verify"
                  className="block text-xs text-ink-gold mb-2 font-annotation tracking-widest uppercase overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Verify
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 bg-asphalt-black/50 border border-concrete-grey/20 text-paper-white rounded-stone h-12 focus:outline-none focus:border-ink-gold transition-all font-field-note"
                  {...register('confirmPassword')}
                />
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-solidarity-red text-[10px] font-annotation uppercase">
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
              {isSubmitting ? 'Recording...' : 'Register'}
            </KeralaRageButton>
          </form>

          <div className="text-center mt-10 pt-6 border-t border-concrete-grey/10">
            <Link
              to="/login"
              className="text-curator-accent text-sm text-concrete-grey hover:text-ink-gold transition-colors"
            >
              Already registered? Sign in.
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
