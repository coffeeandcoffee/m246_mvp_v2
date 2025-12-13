'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', ...props }, ref) => {
        return (
            <label className="checkbox-wrapper">
                <input
                    ref={ref}
                    type="checkbox"
                    className={`checkbox-input ${className}`}
                    {...props}
                />
                <span className="text-body">{label}</span>
            </label>
        )
    }
)

Checkbox.displayName = 'Checkbox'
