import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import * as console from "node:console";

const Home = async () => {
  return (
    <main className="flex">
      <h1>Home</h1>
      <CrudShowcase />
    </main>
  );
};

const CrudShowcase = async () => {
  const session = await getServerAuthSession();
  console.log(session);
  if (!session?.user) return null;

  return (
    <div className="w-full max-w-xs">
      <pre>{JSON.stringify(session.user, null, 2)}</pre>

      <CreatePost />
    </div>
  );
};

export default Home;
