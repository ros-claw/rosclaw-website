import {getRequestConfig} from 'next-intl/server';

// Minimal config - messages are loaded directly in layout.tsx
export default getRequestConfig(async ({locale}) => ({
  locale: locale || 'en',
  messages: {}
}));
