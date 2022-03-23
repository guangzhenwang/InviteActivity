import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Router from './router';
import { store } from './store';
import {QueryClient,QueryClientProvider} from 'react-query'

// new 客户端query实例
const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    // 将 queryClient挂载到组件上 
    <QueryClientProvider client={appQueryClient}>
      <Provider store={store}>
        <Router/>
      </Provider>
    </QueryClientProvider>
  )
}

export default App;
