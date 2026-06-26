import { useEffect, useState } from "react";
import { createContext } from "react";

type ThemeContextType={
     theme:string,
     setTheme:React.Dispatch<React.SetStateAction<string>>
}

const ThemeContext=createContext<ThemeContextType>({
      theme:'light',
      setTheme:()=>{} 
})

function ThemeProvider({children}:{children:React.ReactNode}){
    
    
    
    const [theme,setTheme]=useState<string>('light')
    
    useEffect(()=>{
      const currentTheme=localStorage.getItem('theme')
      if(currentTheme && currentTheme!==theme){
         setTheme(currentTheme)
       }
    },[])


    useEffect(()=>{
       if(localStorage.getItem('theme')!==theme){
         localStorage.setItem('theme',theme)
       }
       document.documentElement.classList.toggle('dark',theme==='dark')        
    },[theme])
    

    return(
        <ThemeContext.Provider value={{theme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}

export {ThemeProvider,ThemeContext}