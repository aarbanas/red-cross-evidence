import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ForbiddenPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-semibold text-2xl">Pristup odbijen</h1>
      <p className="text-muted-foreground">
        Nemate prava za pristup navedenoj stranici.
      </p>
      <Button asChild>
        <Link href="/users">Povratak na početnu</Link>
      </Button>
    </div>
  );
};

export default ForbiddenPage;
