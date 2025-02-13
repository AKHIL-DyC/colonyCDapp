import * as yup from 'yup';
import { MAX_ANNOTATION_LENGTH, MAX_COLONY_DISPLAY_NAME } from '~constants';

export const validationSchema = yup
  .object()
  .shape({
    avatar: yup.object().nullable().shape({
      image: yup.string().nullable().defined(),
      thumbnail: yup.string().nullable().defined(),
    }),
    colonyDisplayName: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Colony name is required.'),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export type EditColonyDetailsFormValues = yup.InferType<
  typeof validationSchema
>;
