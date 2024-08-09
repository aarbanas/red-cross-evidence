import { getServerAuthSession } from "~/server/auth";
import Users from "~/app/users/page";
import Education from "~/app/educations/page";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  // return <Education />;
  return <Users />
};

export default Home;
