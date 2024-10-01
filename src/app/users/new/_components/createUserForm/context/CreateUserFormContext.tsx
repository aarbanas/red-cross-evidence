import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface CreateUserFormValuesType {
  formValues: Record<string, never>;
  updateFormValues: (x: Record<string, never>) => void;
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
  const [formValues, setFormValues] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormValues = (data: Record<string, never>) => {
    setFormValues((prevData) => ({ ...prevData, data }));
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
