'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'text'
    isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'primary', isLoading, disabled, className = '', ...props }, ref) => {
        const baseClass = variant === 'primary' ? 'btn-primary' :
            variant === 'text' ? 'feedback-option' : 'btn-primary'

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`${baseClass} ${className}`}
                {...props}
            >
                {isLoading ? '...' : children}
            </button>
        )
    }
)

Button.displayName = 'Button'
