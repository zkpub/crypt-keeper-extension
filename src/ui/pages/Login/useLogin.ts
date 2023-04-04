import { BaseSyntheticEvent, useCallback } from "react";
import { UseFormRegister, useForm } from "react-hook-form";

import { unlock } from "@src/ui/ducks/app";
import { useAppDispatch } from "@src/ui/ducks/hooks";

export interface IUseLoginData {
  isLoading: boolean;
  errors: Partial<FormFields>;
  register: UseFormRegister<FormFields>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
}

interface FormFields {
  password: string;
}

export const useLogin = (): IUseLoginData => {
  const {
    formState: { isLoading, isSubmitting, errors },
    setError,
    register,
    handleSubmit,
  } = useForm<FormFields>({
    defaultValues: {
      password: "",
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (data: FormFields) => {
      dispatch(unlock(data.password)).catch((error: Error) =>
        setError("password", { type: "submit", message: error.message }),
      );
    },
    [dispatch, setError],
  );

  return {
    isLoading: isLoading || isSubmitting,
    errors: {
      password: errors.password?.message,
    },
    register,
    onSubmit: handleSubmit(onSubmit),
  };
};