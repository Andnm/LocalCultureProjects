import React from "react";

type FormValues = {
  email: string;
  password: string;
};

interface InputChangeHook {
  (event: React.ChangeEvent<HTMLInputElement>, field: keyof FormValues): void;
}

export const useInputChange = (
  initialData: FormValues
): [FormValues, InputChangeHook] => {
  const [formData, setFormData] = React.useState(initialData);

  const handleInputChange: InputChangeHook = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormValues
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: event.target.value,
    }));
  };

  return [formData, handleInputChange];
};
