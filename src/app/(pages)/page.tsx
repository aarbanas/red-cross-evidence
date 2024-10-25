import { getServerAuthSession } from "~/server/auth";
import Users from "~/app/users/page";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <>
      <Users />
    </>
  );
};

export default Home;
