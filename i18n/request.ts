import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Ensure locale is always defined
  const safeLocale = locale || 'en';
  
  try {
    const messages = (await import(`../messages/${safeLocale}.json`)).default;
    
    return {
      locale: safeLocale,
      messages
    };
  } catch (error) {
    // Fallback to English if locale file not found
    const messages = (await import('../messages/en.json')).default;
    
    return {
      locale: 'en',
      messages
    };
  }
});
