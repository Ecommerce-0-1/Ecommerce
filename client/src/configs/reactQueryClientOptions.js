export const reactQueryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60,
      retry: 0,
    },
  },
};
