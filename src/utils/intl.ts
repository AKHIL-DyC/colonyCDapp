import { createIntl, createIntlCache } from '@formatjs/intl';
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
export const intl = (messages: Record<string, string> = {}, locale = 'en') =>
  createIntl(
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
