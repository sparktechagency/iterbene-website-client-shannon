let promise: Promise<void> | null = null;

export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  if (promise) {
    return promise;
  }

  promise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = (error) => {
      promise = null; // Reset on error to allow retries
      reject(error);
    };

    document.head.appendChild(script);
  });

  return promise;
};