import { createContext, useContext, useState } from 'react';

const TabBarContext = createContext(null);

export function TabBarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TabBarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  return useContext(TabBarContext);
}