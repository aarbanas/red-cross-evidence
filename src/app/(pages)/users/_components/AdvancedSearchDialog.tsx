'use client';
import { BotMessageSquare, Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CROATIAN_COUNTIES } from '@/server/constants/counties';
import type { VolunteerSearchQuery } from '@/server/search/volunteerSearchFields';
import { api } from '@/trpc/react';

type Props = {
  onFiltersApplied: (filters: VolunteerSearchQuery) => void;
};

type Step = 'prompt' | 'review';

const LANGUAGE_LEVELS = ['osnovno', 'srednje', 'napredno', 'izvorno'] as const;

const isFiltersEmpty = (filters: VolunteerSearchQuery): boolean => {
  if (filters.location?.city || filters.location?.county) return false;
  if (filters.licenses?.length) return false;
  if (filters.courses?.length) return false;
  if (filters.languages?.length) return false;
  if (filters.age?.min != null || filters.age?.max != null) return false;
  if (filters.active != null) return false;
  return true;
};

const AdvancedSearchDialog: FC<Props> = ({ onFiltersApplied }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('prompt');
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VolunteerSearchQuery>({});
  const [courseKeys, setCourseKeys] = useState<string[]>([]);
  const [licenseKeys, setLicenseKeys] = useState<string[]>([]);
  const [languageKeys, setLanguageKeys] = useState<string[]>([]);

  const { data: llmUsage } = api.config.getLlmUsage.useQuery(undefined, {
    enabled: open,
  });

  const parsePrompt = api.search.parsePrompt.useMutation({
    onSuccess: (result) => {
      if (isFiltersEmpty(result)) {
        setError('Nisu pronađeni filteri, pokušajte precizirati upit.');
        return;
      }

      setFilters(result);
      setLicenseKeys((result.licenses ?? []).map(() => crypto.randomUUID()));
      setLanguageKeys((result.languages ?? []).map(() => crypto.randomUUID()));
      setCourseKeys((result.courses ?? []).map(() => crypto.randomUUID()));
      setError(null);
      setStep('review');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = () => {
    setError(null);
    parsePrompt.mutate({ prompt: query });
  };

  const handleApply = () => {
    const finalFilters: VolunteerSearchQuery = {
      ...filters,
      courses: filters.courses?.filter((c) => c.name.trim()).length
        ? filters.courses.filter((c) => c.name.trim())
        : undefined,
    };

    onFiltersApplied(finalFilters);
    setOpen(false);
    setQuery('');
    setError(null);
    setStep('prompt');
    setFilters({});
    setCourseKeys([]);
    setLicenseKeys([]);
    setLanguageKeys([]);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery('');
      setError(null);
      setStep('prompt');
      setFilters({});
      setCourseKeys([]);
      setLicenseKeys([]);
      setLanguageKeys([]);
    }

    setOpen(next);
  };

  const handleBack = () => {
    setStep('prompt');
    setError(null);
  };

  const updateCourse = (index: number, value: string) => {
    setFilters((prev) => {
      const courses = [...(prev.courses ?? [])];
      courses[index] = { ...courses[index]!, name: value };
      return { ...prev, courses };
    });
  };

  const removeCourse = (index: number) => {
    setFilters((prev) => ({
      ...prev,
      courses: (prev.courses ?? []).filter((_, i) => i !== index),
    }));
    setCourseKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLocation = (field: 'city' | 'county', value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value || null },
    }));
  };

  const updateLicense = (index: number, value: string) => {
    setFilters((prev) => {
      const licenses = [...(prev.licenses ?? [])];
      licenses[index] = { type: value };
      return { ...prev, licenses };
    });
  };

  const addLicense = () => {
    setFilters((prev) => ({
      ...prev,
      licenses: [...(prev.licenses ?? []), { type: '' }],
    }));
    setLicenseKeys((prev) => [...prev, crypto.randomUUID()]);
  };

  const removeLicense = (index: number) => {
    setFilters((prev) => ({
      ...prev,
      licenses: (prev.licenses ?? []).filter((_, i) => i !== index),
    }));
    setLicenseKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLanguage = (
    index: number,
    field: 'name' | 'level',
    value: string | null,
  ) => {
    setFilters((prev) => {
      const languages = [...(prev.languages ?? [])];
      languages[index] = { ...languages[index]!, [field]: value };
      return { ...prev, languages };
    });
  };

  const addLanguage = () => {
    setFilters((prev) => ({
      ...prev,
      languages: [...(prev.languages ?? []), { name: '', level: null }],
    }));
    setLanguageKeys((prev) => [...prev, crypto.randomUUID()]);
  };

  const removeLanguage = (index: number) => {
    setFilters((prev) => ({
      ...prev,
      languages: (prev.languages ?? []).filter((_, i) => i !== index),
    }));
    setLanguageKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAge = (field: 'min' | 'max', value: string) => {
    const num = value === '' ? null : Number(value);
    setFilters((prev) => ({
      ...prev,
      age: { ...prev.age, [field]: num },
    }));
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <BotMessageSquare className="h-4 w-4" />
        Napredno pretraživanje
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Napredno pretraživanje</DialogTitle>
            {llmUsage && (
              <div className="flex flex-col gap-1">
                <Progress
                  value={Math.round(
                    (llmUsage.callCount / llmUsage.limit) * 100,
                  )}
                  className="h-1.5"
                />
                <p className="text-muted-foreground text-xs">
                  {llmUsage.callCount} / {llmUsage.limit} poziva ovaj mjesec
                </p>
              </div>
            )}
            <DialogDescription>
              {step === 'prompt'
                ? 'Opišite koje volontere tražite na hrvatskom jeziku.'
                : 'Pregledajte i prilagodite filtere prije pretraživanja.'}
            </DialogDescription>
          </DialogHeader>

          {step === 'prompt' ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='npr. "Trebaju mi volonteri iz Rijeke s položenom vozačkom B kategorije..."'
                rows={4}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {(filters.location?.city != null ||
                filters.location?.county != null) && (
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Lokacija</Label>
                  {filters.location?.city != null && (
                    <div className="flex flex-col gap-1">
                      <Label className="text-muted-foreground text-sm">
                        Grad
                      </Label>
                      <Input
                        value={filters.location.city ?? ''}
                        onChange={(e) => updateLocation('city', e.target.value)}
                        placeholder="Grad"
                      />
                    </div>
                  )}
                  {filters.location?.county != null && (
                    <div className="flex flex-col gap-1">
                      <Label className="text-muted-foreground text-sm">
                        Županija
                      </Label>
                      <Select
                        value={filters.location.county ?? '__none__'}
                        onValueChange={(v) =>
                          updateLocation('county', v === '__none__' ? null : v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Odaberite županiju" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">—</SelectItem>
                          {CROATIAN_COUNTIES.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {!!filters.licenses?.length && (
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Vozačke dozvole</Label>
                  {(filters.licenses ?? []).map((license, i) => (
                    <div key={licenseKeys[i]} className="flex gap-2">
                      <Input
                        value={license.type}
                        onChange={(e) => updateLicense(i, e.target.value)}
                        placeholder="npr. B"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLicense(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={addLicense}
                  >
                    <Plus className="h-4 w-4" />
                    Dodaj dozvolu
                  </Button>
                </div>
              )}

              {!!filters.courses?.length && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Tečajevi</Label>
                    {filters.courses.length > 1 && (
                      <Select
                        value={filters.coursesOperator ?? 'AND'}
                        onValueChange={(v) =>
                          setFilters((prev) => ({
                            ...prev,
                            coursesOperator: v as 'AND' | 'OR',
                          }))
                        }
                      >
                        <SelectTrigger className="h-7 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">I (AND)</SelectItem>
                          <SelectItem value="OR">ILI (OR)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {filters.courses.map((course, i) => (
                    <div key={courseKeys[i]} className="flex gap-2">
                      <Input
                        value={course.name}
                        onChange={(e) => updateCourse(i, e.target.value)}
                        placeholder="Naziv tečaja"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCourse(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {!!filters.languages?.length && (
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Jezici</Label>
                  {(filters.languages ?? []).map((lang, i) => (
                    <div
                      key={languageKeys[i]}
                      className="flex items-center gap-2"
                    >
                      <Input
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(i, 'name', e.target.value)
                        }
                        placeholder="Jezik"
                        className="flex-1"
                      />
                      <Select
                        value={lang.level ?? '__none__'}
                        onValueChange={(v) =>
                          updateLanguage(
                            i,
                            'level',
                            v === '__none__' ? null : v,
                          )
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Razina" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">—</SelectItem>
                          {LANGUAGE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLanguage(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={addLanguage}
                  >
                    <Plus className="h-4 w-4" />
                    Dodaj jezik
                  </Button>
                </div>
              )}

              {(filters.age?.min != null || filters.age?.max != null) && (
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Dob</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={filters.age?.min ?? ''}
                      onChange={(e) => updateAge('min', e.target.value)}
                      placeholder="Od"
                      className="w-24"
                    />
                    <span className="text-muted-foreground text-sm">—</span>
                    <Input
                      type="number"
                      value={filters.age?.max ?? ''}
                      onChange={(e) => updateAge('max', e.target.value)}
                      placeholder="Do"
                      className="w-24"
                    />
                  </div>
                </div>
              )}

              {filters.active != null && (
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Status</Label>
                  <Select
                    value={String(filters.active)}
                    onValueChange={(v) =>
                      setFilters((prev) => ({ ...prev, active: v === 'true' }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Aktivni</SelectItem>
                      <SelectItem value="false">Neaktivni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {step === 'prompt' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Odustani
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!query.trim() || parsePrompt.isPending}
                >
                  {parsePrompt.isPending ? 'Pretražujem...' : 'Pretraži'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleBack}>
                  Natrag
                </Button>
                <Button onClick={handleApply}>Pretraži</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdvancedSearchDialog;
