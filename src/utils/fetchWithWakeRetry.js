import axios from "axios";

const DEFAULT_RETRY_DELAY_MS = 3000;
const DEFAULT_MAX_ATTEMPTS = 6;

const sleep = (delayMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

export const isWakeUpNetworkError = (error) =>
  error?.code === "ERR_NETWORK" && !error?.response;

export const fetchWithWakeRetry = async (
  url,
  {
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  } = {},
) => {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await axios.get(url);
    } catch (error) {
      attempt += 1;

      if (!isWakeUpNetworkError(error) || attempt >= maxAttempts) {
        throw error;
      }

      await sleep(retryDelayMs);
    }
  }

  throw new Error("Unable to reach the server.");
};

export default fetchWithWakeRetry;
