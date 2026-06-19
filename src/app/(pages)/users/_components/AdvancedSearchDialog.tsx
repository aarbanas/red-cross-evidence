'use client';
import { BotMessageSquare } from 'lucide-react';
import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { VolunteerSearchQuery } from '@/server/search/volunteerSearchFields';
import { api } from '@/trpc/react';

type Props = {
  onFiltersApplied: (filters: VolunteerSearchQuery) => void;
};

const AdvancedSearchDialog: FC<Props> = ({ onFiltersApplied }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parsePrompt = api.search.parsePrompt.useMutation({
    onSuccess: (filters) => {
      onFiltersApplied(filters);
      setOpen(false);
      setQuery('');
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    setError(null);
    parsePrompt.mutate({ prompt: query });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery('');
      setError(null);
    }

    setOpen(next);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <BotMessageSquare className="h-4 w-4" />
        Napredno pretraživanje
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Napredno pretraživanje</DialogTitle>
            <DialogDescription>
              Opišite koje volontere tražite na hrvatskom jeziku.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='npr. "Trebaju mi volonteri iz Rijeke s položenom vozačkom B kategorije..."'
              rows={4}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Odustani
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!query.trim() || parsePrompt.isPending}
            >
              {parsePrompt.isPending ? 'Pretražujem...' : 'Pretraži'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdvancedSearchDialog;
