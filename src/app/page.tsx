import { getServerAuthSession } from "~/server/auth";
import Users from "~/app/users/page";
import CustomForm from "./users/testForm";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <>
      <Users />
      <CustomForm />
    </>
  );
};

export default Home;
