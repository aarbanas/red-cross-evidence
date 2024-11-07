import { getServerAuthSession } from "~/server/auth";
import UsersPage from "~/app/(pages)/users/page";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <>
      <UsersPage />
    </>
  );
};

export default Home;
