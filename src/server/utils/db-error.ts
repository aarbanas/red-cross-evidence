type PgError = {
  code?: string;
  constraint?: string;
};

const PG_UNIQUE_VIOLATION = '23505';
const PG_FK_VIOLATION = '23503';
const PG_NOT_NULL_VIOLATION = '23502';

export const mapDbError = (error: unknown): Error => {
  const cause = (error as { cause?: PgError })?.cause;

  if (cause?.code === PG_UNIQUE_VIOLATION) {
    if (cause.constraint?.includes('oib')) {
      return new Error('Korisnik s tim OIB-om već postoji u sustavu.');
    }

    return new Error('Zapis s ovim podacima već postoji u sustavu.');
  }

  if (cause?.code === PG_FK_VIOLATION) {
    return new Error('Referencirani zapis ne postoji u sustavu.');
  }

  if (cause?.code === PG_NOT_NULL_VIOLATION) {
    return new Error('Nedostaje obavezno polje.');
  }

  return new Error(
    'Došlo je do pogreške pri spremanju podataka. Molimo pokušajte ponovo.',
  );
};
