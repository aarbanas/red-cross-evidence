import { getServerAuthSession } from "~/server/auth";
import Users from "~/app/users/page";
import Wizard from "~/components/organisms/wizard/Wizard";
import { placeholder } from "drizzle-orm";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const inputs = [
    [
      {
        type: "text",
        placeholder: "Your username goes here",
        label: "Username",
      },
      {
        type: "password",
        placeholder: "Your password goes here",
        label: "Password",
      },
      {
        type: "password",
        placeholder: "Repeat your password here",
        label: "Repeat Password",
      },
    ],
    [
      {
        type: "email",
        label: "Email Address",
        placeholder: "Your email goes here",
      },
      {
        type: "text",
        label: "Phone Number",
        placeholder: "Your phone number goes here",
      },
    ],
    [
      {
        type: "text",
        label: "Credit Card Number",
        placeholder: "Your credit card number goes here",
      },
      {
        type: "text",
        label: "Billing Address",
        placeholder: "Your billing address goes here",
      },
    ],
  ];
  return (
    <>
      <Users />
      <Wizard steps={["Sign Up", "Details", "Billing"]} inputs={inputs} />
    </>
  );
};

export default Home;
