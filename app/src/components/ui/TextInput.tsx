'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-muted mb-2 text-sm">{label}</label>
                )}
                <input
                    ref={ref}
                    className={`input-text ${className}`}
                    {...props}
                />
            </div>
        )
    }
)

TextInput.displayName = 'TextInput'
