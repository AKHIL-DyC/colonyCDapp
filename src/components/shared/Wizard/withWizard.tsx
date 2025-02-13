import React, { ComponentType, useState } from 'react';

import { useAppContext } from '~hooks';
import { User } from '~types';

import {
  InitialValuesProp,
  StepsValues,
  StepValues,
  WizardOuterProps,
  WizardStepProps,
} from './types';

export type StepType = ComponentType<any> & { stepName?: string };

export type StepsFn<T> = (step: number, values: any, props?: T) => StepType;

type Steps = StepType[] | StepsFn<any>;

interface WizardArgs<T> {
  initialValues?: InitialValuesProp<T>;
  stepCount?: number;
  steps: Steps;
}

const getStep = <T,>(
  steps: Steps,
  step: number,
  values: T,
  loggedInUser?: User | null,
) =>
  typeof steps === 'function' ? steps(step, values, loggedInUser) : steps[step];

const all = <T,>(values: StepsValues<T>) =>
  values.reduce(
    (acc, current) => ({
      ...acc,
      ...current,
    }),
    {},
  );

const withWizard =
  <F, P = Record<string, never>>({
    initialValues: initialValuesProp = [],
    steps,
    stepCount: maxSteps,
  }: WizardArgs<F>) =>
  (
    OuterComponent: ComponentType<WizardOuterProps<F>>,
    stepsProps?: WizardStepProps<F, P, Partial<F>>,
  ) => {
    const Wizard = (wizardProps: P) => {
      const { user } = useAppContext();
      const [step, setStep] = useState(0);

      const [stepsValues, setStepsValues] = useState<StepsValues<F>>([]);
      const mergedValues = all(stepsValues) as F;

      const Step = getStep(steps, step, mergedValues, user);
      if (!Step) throw new Error('Step needs to be implemented!');

      const displayedStep = step + 1;
      const stepCount = maxSteps || steps.length;

      const next = (vals: StepValues<F> | undefined) => {
        if (vals) {
          setStepsValues((currentVals) => {
            const valsCopy = [...currentVals];
            valsCopy[step] = vals;
            return valsCopy;
          });
        }
        setStep((wizardStep) => wizardStep + 1);
      };

      const prev = (vals: StepValues<F> | undefined) => {
        if (step === 0) {
          return false;
        }

        if (vals) {
          setStepsValues((currentVals) => {
            const valsCopy = [...currentVals];
            valsCopy[step] = vals;
            return valsCopy;
          });
        }

        setStep((wizardStep) => (wizardStep === 0 ? 0 : wizardStep - 1));
        return true;
      };

      const reset = () => {
        setStep(0);
        setStepsValues([]);
      };

      const stepValues = stepsValues[step];
      const initialValues =
        typeof initialValuesProp === 'function'
          ? initialValuesProp(user)
          : initialValuesProp;
      const initialStepValues = initialValues[step];
      return (
        <OuterComponent
          step={displayedStep}
          stepCount={stepCount}
          nextStep={next}
          previousStep={prev}
          resetWizard={reset}
          wizardValues={mergedValues}
          loggedInUser={user}
        >
          <Step
            step={displayedStep}
            stepCount={stepCount}
            nextStep={next}
            previousStep={prev}
            setStep={setStep}
            resetWizard={reset}
            setStepsValues={setStepsValues}
            wizardValues={mergedValues}
            wizardProps={wizardProps}
            // Wizard form helpers to take some shortcuts if needed
            wizardForm={{
              // Get values just for this step
              initialValues: stepValues || initialStepValues || {},
              // It should be valid if we submitted values for this step before
              validateOnMount: !!stepsValues,
            }}
            {...stepsProps}
            {...wizardProps}
          />
        </OuterComponent>
      );
    };

    return Wizard;
  };

export default withWizard;
