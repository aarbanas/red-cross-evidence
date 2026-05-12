import { redirect } from 'next/navigation';
import { auth } from '~/server/auth/index';

const Home = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  } else {
    redirect('/users');
  }
};

export default Home;
