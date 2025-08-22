 // utils/api.ts

 interface ApiOptions extends RequestInit {
  // You can add custom options here if needed, e.g., 'requiresAuth: true'
}

// Helper function to create a delay promise
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function postData<T>(
  // endpoint: string,
  data: any,
  options?: ApiOptions
): Promise<T> {
  const baseUrl = 'http://192.168.1.52/index.php'; // Updated base URL
  // const url = `${baseUrl}${endpoint}`;
  const MIN_LOADING_TIME = 2000; // Reduced to 2 seconds for a better user experience in most cases

  try {
    // 1. Create the API fetch promise
    const apiCallPromise = fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ...options,
    });

    const minDelayPromise = delay(MIN_LOADING_TIME);

    // 2. Wait for both the API call and the minimum delay to complete
    const [apiResponseResult, delayResult] = await Promise.allSettled([apiCallPromise, minDelayPromise]);

    // 3. Handle the result of the API call promise
    if (apiResponseResult.status === 'rejected') {
      console.error('API call error:', apiResponseResult.reason);
      throw apiResponseResult.reason;
    }

    const response = apiResponseResult.value;

    if (!response.ok) {
      // Attempt to parse the error message from the response body
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error; // Re-throw to be handled by the calling component/function
  }
}


