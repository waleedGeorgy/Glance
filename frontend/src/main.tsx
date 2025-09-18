import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        try {
          const res = await fetch(`/api/${queryKey[0]}`, { credentials: "include" });
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Something went wrong");

          return data;
        } catch (error) {
          console.log(error)
          return null;
        }
      },
      refetchOnWindowFocus: false
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </>,
)
