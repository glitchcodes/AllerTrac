export const phoneMaskOptions = {
  mask: ['0', '9', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/],
  elementPredicate: (el: HTMLIonInputElement) => {
    return new Promise((resolve) => {
      requestAnimationFrame(async () => {
        const input = await el.getInputElement();
        resolve(input);
      })
    })
  }
}

export const formatToFriendlyDate = (value: string) => {
  if (value.length === 0) return;

  const date = new Date(value);
  const formattedDate = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return formattedDate.format(date);
}

export const randomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const capitalizeString = (str: string): string => {
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertToHttps = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.protocol = 'https:';

    return parsedUrl.toString();
  } catch (error) {
    console.error('Invalid URL:', error);
    return url;
  }
};
