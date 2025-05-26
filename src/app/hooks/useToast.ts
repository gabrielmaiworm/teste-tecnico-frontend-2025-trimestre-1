import { useState, useEffect } from 'react'
import { Toast } from '../types/contact'

export const useToast = () => {
    const [toast, setToast] = useState<Toast | null>(null)

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type })
    }

    return { 
        toast, 
        showToast 
    }
}
