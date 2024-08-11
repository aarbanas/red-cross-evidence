import { getServerAuthSession } from "~/server/auth";
import Users from "~/app/users/page";
import MultiStepForm from "~/components/organisms/multiStepForm/MultiStepFormNEW";
import { FormStep } from "~/components/organisms/multiStepForm/MultiStepFormNEW";
import { SignUpForm } from "~/components/organisms/forms/SignUp";
import { DetailsForm } from "~/components/organisms/forms/Details";
import { BillingForm } from "~/components/organisms/forms/Billing";

const Home = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  const test: FormStep[] = [
    {
      name: "Sign Up",
      form: <SignUpForm />,
    },
    {
      name: "Details",
      form: <DetailsForm />,
    },
    {
      name: "Billing",
      form: <BillingForm />,
    },
  ];
  return (
    <>
      <Users />
      <MultiStepForm forms={test} />
    </>
  );
};

export default Home;
