'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UserEditIndexPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/users/${id}/personal-information`);
  }, [id, router]);

  return null;
};

export default UserEditIndexPage;
