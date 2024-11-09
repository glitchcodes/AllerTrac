import {LatLng} from "@capacitor/google-maps/dist/typings/definitions";

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

export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const buildAddressString = (addressComponents: { longText: string, shortText: string, types: string[] }[]) => {
  const addressMap = {
    street_number: '',
    route: '',
    locality: '',
    administrative_area_level_1: '',
    country: '',
    postal_code: ''
  };

  // Populate the addressMap with the relevant address component values
  addressComponents.forEach(component => {
    if (component.types.includes('street_number')) {
      addressMap.street_number = component.longText;
    }
    if (component.types.includes('route')) {
      addressMap.route = component.longText;
    }
    if (component.types.includes('locality')) {
      addressMap.locality = component.longText;
    }
    if (component.types.includes('administrative_area_level_1')) {
      addressMap.administrative_area_level_1 = component.shortText;
    }
  });

  // Construct the address string
  return [
    `${addressMap.street_number} ${addressMap.route}`.trim(),
    addressMap.locality,
    addressMap.administrative_area_level_1
  ].filter(Boolean).join(', ');
}

/**
 * Calculate distance between two points
 *
 * Uses Haversine formula
 * https://mapsplatform.google.com/resources/blog/how-calculate-distances-map-maps-javascript-api/
 *
 * @param pos1
 * @param pos2
 */
export const calculateDistance = (pos1: LatLng, pos2: LatLng) => {
  const R = 3958.8; // Radius of the Earth in miles
  const rlat1 = pos1.lat * (Math.PI/180); // Convert degrees to radians
  const rlat2 = pos2.lat * (Math.PI/180); // Convert degrees to radians
  const difflat = rlat2-rlat1; // Radian difference (latitudes)
  const difflon = (pos2.lng - pos1.lng) * (Math.PI/180); // Radian difference (longitudes)

  const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));

  // Convert miles to km
  const km = d * 1.609;

  return km.toFixed(2);
}