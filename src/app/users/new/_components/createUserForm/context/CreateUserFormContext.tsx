import React, {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { type CreateUserType } from "~/server/api/schema/createUser.schema";

interface CreateUserFormValuesType {
  formValues: CreateUserType | null;
  updateFormValues: (x: Partial<CreateUserType>) => void;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

interface Props {
  children: React.ReactNode;
}

const CreateUserFormContext = createContext<CreateUserFormValuesType | null>(
  null,
);

export const CreateUserFormProvider = ({ children }: Props) => {
  const [formValues, setFormValues] = useState<CreateUserType | undefined>(
    undefined,
  );
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormValues = (data: Partial<CreateUserType>) => {
    setFormValues((prevState) => {
      return { ...(prevState ?? {}), ...data };
    });
  };

  const values = {
    formValues,
    updateFormValues,
    currentStep,
    setCurrentStep,
  };

  return (
    <CreateUserFormContext.Provider value={values}>
      {children}
    </CreateUserFormContext.Provider>
  );
};

export const useCreateUserFormContext = () => {
  const context = useContext(CreateUserFormContext);
  if (context === null) {
    throw new Error("CreateUserFormContext is missing");
  }

  return context;
};
