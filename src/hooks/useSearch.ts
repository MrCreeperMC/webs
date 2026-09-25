import { useState, useCallback, useRef, useEffect } from 'react'

export function useSearch(onSearch: (query: string) => void, delay = 300) {
  const [inputValue, setInputValue] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const debouncedSearch = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onSearch(value)
      }, delay)
    },
    [onSearch, delay]
  )

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value)
      debouncedSearch(value)
    },
    [debouncedSearch]
  )

  const clear = useCallback(() => {
    setInputValue('')
    onSearch('')
  }, [onSearch])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { value: inputValue, handleChange, clear }
}
