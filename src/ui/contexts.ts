import { createContext } from 'react'

export const GlobalContext = createContext({
  displayFeedback: (_error: boolean, _message: string) => {}
})
