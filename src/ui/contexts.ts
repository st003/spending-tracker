import { createContext } from 'react';

export const GlobalContext = createContext({
  displayFeedback: (error: boolean, message: string) => {}
})
