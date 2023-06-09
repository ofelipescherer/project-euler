'use client'

import { useThemeContext } from '@/context/theme.context'
import { appConfig } from '@/utils/config'
import { Moon, Sun } from 'phosphor-react'
import { useCallback, useEffect } from 'react'

const themes = ['dark', 'light']

function loadTheme(): string {
  let theme = ''

  // Faz o loading do localstorage para verificar se tem tema salvo,
  const storagedTheme = window.localStorage.getItem(
    `${appConfig.app_slug}:theme`
  )
  if (storagedTheme && themes.includes(storagedTheme)) {
    // Se tem, dar preferencia e carregar esse tema
    theme = storagedTheme
  } else {
    // Não achou, verifica o prefers color scheme
    if (window.matchMedia('(prefers-color-scheme:dark)').matches) theme = 'dark'
    else if (window.matchMedia('(prefers-color-scheme:light)').matches)
      theme = 'light'
    // Não tem preferencia deixa como light
    else theme = 'light'
  }

  return theme
}

type ThemeButtonProps = {
  btnColor?: string
}

export function ThemeButton({ btnColor = 'text-primary' }: ThemeButtonProps) {
  const { setTheme, theme } = useThemeContext()

  const setNewTheme = useCallback(
    (newTheme: string) => {
      window.localStorage.setItem(`${appConfig.app_slug}:theme`, newTheme)
      window.document.documentElement.setAttribute('data-theme', newTheme)
      setTheme(newTheme)
    },
    [setTheme]
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme =
        window.document.documentElement.getAttribute('data-theme')
      savedTheme && setTheme(savedTheme)
    }
  }, [setTheme])

  useEffect(() => {
    const savedTheme = loadTheme()
    setNewTheme(savedTheme)
  }, [setNewTheme])

  function handleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setNewTheme(newTheme)
  }

  return (
    <button onClick={handleTheme} className={`interaction ${btnColor}`}>
      {theme === 'light' ? (
        <Moon size={24} weight="fill" />
      ) : (
        <Sun size={24} weight="fill" />
      )}
    </button>
  )
}

