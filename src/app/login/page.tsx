import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Prijava | Crveni Križ Evidencija',
};

export default function LoginPage() {
  return <LoginForm />;
}
