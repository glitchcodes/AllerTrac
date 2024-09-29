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