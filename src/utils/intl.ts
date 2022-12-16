import { createIntl, createIntlCache } from '@formatjs/intl';
import { MessageDescriptor } from 'react-intl';
import { ReactNode } from 'react';

import { Message, UniversalMessageValues } from '~types';

import colonyMessages from '../i18n/en.json';
import actionMessages from '../i18n/en-actions';
import eventsMessages from '../i18n/en-events';
import motionMessages from '../i18n/en-motions';
import systemMessages from '../i18n/en-system-messages';

// https://formatjs.io/docs/intl

const cache = createIntlCache();

/* For use outside of React components */
/**
 *
 * @param messages A messages object of the form: { id: message }
 * @param locale Specify the locale. Defaults to 'en'.
 * @returns Intl object, with helpful utils such as `formatMessage`
 */
export const intl = <T = string>(
  messages: Record<string, string> = {},
  locale = 'en',
) =>
  createIntl<T>(
    {
      messages: {
        ...colonyMessages,
        ...actionMessages,
        ...eventsMessages,
        ...motionMessages,
        ...systemMessages,
        ...messages,
      },
      locale,
    },
    cache,
  );

const isMessageDescriptor = (message?: Message): message is MessageDescriptor =>
  typeof message === 'object' &&
  ('id' in message || 'description' in message || 'defaultMessage' in message);

const { formatMessage: formatIntlMessage } = intl<ReactNode>();

export const formatText = (
  message?: Message,
  messageValues?: UniversalMessageValues,
) =>
  isMessageDescriptor(message)
    ? formatIntlMessage(message, messageValues)
    : message;
