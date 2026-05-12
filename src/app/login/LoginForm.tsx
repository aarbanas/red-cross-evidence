'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useActionState, useState } from 'react';
import { Button } from '~/components/atoms/Button';
import { Input } from '~/components/atoms/Input';
import { Label } from '~/components/atoms/Label';
import { loginAction } from './actions';

export function LoginForm() {
  const [error, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm rounded-xl border border-red-100 bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Image
            src="/logo.png"
            alt="Crveni Križ logo"
            width={240}
            height={61}
            priority
          />
          <div className="h-px w-full bg-red-200" />
          <h1 className="font-semibold text-gray-800 text-xl">
            Crveni Križ Evidencija
          </h1>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="password" value={password} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="korisnik@crveni-kriz.hr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Lozinka</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-red-600 text-sm">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
          >
            {isPending ? 'Prijava...' : 'Prijava'}
          </Button>
        </form>
      </div>
    </div>
  );
}
