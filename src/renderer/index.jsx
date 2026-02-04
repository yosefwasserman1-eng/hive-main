/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import App from "./App";
import { HiveSocket } from "./app_hooks";
import { useSettingsData } from "./api/useHiveFetch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function SocketProvider({ children }) {
  const settings = useSettingsData();
  const [ws, setWs] = useState(new WebSocket("ws://api-hive.strangled.net"));

  useEffect(() => {
    if (settings.data) {
      setWs(
        new WebSocket(
          settings.data.serverPort
            ? `ws://${settings.data.serverHost}:${settings.data.serverPort}`
            : `ws://${settings.data.serverHost}`
        )
      );
    }
  }, [settings.data]);
  return (
    <HiveSocket.Provider value={[ws, setWs]}>{children}</HiveSocket.Provider>
  );
}

function Main() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <SocketProvider>
            <App />
            <ReactQueryDevtools />
          </SocketProvider>
        </HashRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default Main;
