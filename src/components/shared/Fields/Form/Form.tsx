import React, { useEffect, useImperativeHandle } from 'react';
import {
  useForm,
  UseFormProps,
  FormProvider,
  UseFormReturn,
  FieldValues,
  FieldErrors,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schema } from 'yup';
import AdditionalFormOptionsContextProvider from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';
import { AdditionalFormOptionsContextValue } from '~context/AdditionalFormOptionsContext/types';

const displayName = 'Form';

export type CustomSubmitHandler<FormData extends FieldValues> = (
  data: FormData,
  formHelpers: UseFormReturn<FormData>,
  event?: React.BaseSyntheticEvent,
) => any | Promise<any>;
export type CustomSubmitErrorHandler<FormData extends FieldValues> = (
  errors: FieldErrors<FormData>,
  formHelpers: UseFormReturn<FormData, any>,
  event?: React.BaseSyntheticEvent,
) => any | Promise<any>;

export interface FormProps<FormData extends FieldValues> {
  children:
    | ((props: UseFormReturn<FormData>) => React.ReactNode)
    | React.ReactNode;
  onSubmit: CustomSubmitHandler<FormData>;
  onError?: CustomSubmitErrorHandler<FormData>;
  validationSchema?: Schema<FormData>;
  defaultValues?: UseFormProps<FormData>['defaultValues'];
  mode?: UseFormProps<FormData>['mode'];
  options?: UseFormProps<FormData> & AdditionalFormOptionsContextValue;
  /** Pass true to reset the default values to latest values on form submission. This will reset the isDirty prop. */
  resetOnSubmit?: boolean;
  className?: string;
}

const Form = <FormData extends FieldValues>(
  {
    children,
    defaultValues,
    mode = 'onTouched',
    onSubmit,
    onError,
    options,
    resetOnSubmit = false,
    validationSchema,
    className,
  }: FormProps<FormData>,
  ref: React.ForwardedRef<UseFormReturn<FormData, any, undefined>>,
) => {
  const { readonly, ...formOptions } = options || {};
  const formHelpers = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
    mode,
    ...formOptions,
  });

  useImperativeHandle(ref, () => formHelpers);

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = formHelpers;
  const values = watch();

  /*
   * Effect resets default values to latest values, which resets the isDirty prop.
   * Useful in user settings.
   */
  useEffect(() => {
    if (isSubmitting && resetOnSubmit) {
      reset(values);
    }
  }, [isSubmitting, values, resetOnSubmit, reset]);

  return (
    <AdditionalFormOptionsContextProvider value={{ readonly }}>
      <FormProvider {...formHelpers}>
        <form
          className={className}
          onSubmit={handleSubmit(
            (data, e) => onSubmit(data, formHelpers, e),
            (errors, e) => onError && onError(errors, formHelpers, e),
          )}
        >
          {typeof children === 'function' ? children(formHelpers) : children}
        </form>
      </FormProvider>
    </AdditionalFormOptionsContextProvider>
  );
};

Form.displayName = displayName;

export default React.forwardRef(Form);
