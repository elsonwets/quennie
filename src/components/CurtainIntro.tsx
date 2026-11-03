import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

const CurtainIntroContext = createContext({ ready: true, isHome: false, finish: () => {} })

export function CurtainIntroProvider({ isHome, children }: { isHome: boolean; children: ReactNode }) {
  const [ready, setReady] = useState(!isHome)
  const finish = useCallback(() => setReady(true), [])
  return (
    <CurtainIntroContext.Provider value={{ ready, isHome, finish }}>
      {children}
    </CurtainIntroContext.Provider>
  )
}

export const useCurtainIntro = () => useContext(CurtainIntroContext)
