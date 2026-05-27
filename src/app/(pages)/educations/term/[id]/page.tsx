'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const EducationTermIndexPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/educations/term/${id}/edit`);
  }, [id, router]);

  return null;
};

export default EducationTermIndexPage;
