import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  } else {
    redirect("/users");
  }
};

export default Home;
