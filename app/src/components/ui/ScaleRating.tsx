'use client'

interface ScaleRatingProps {
    value: number | null
    onChange: (value: number) => void
    maxLabel?: string
}

export function ScaleRating({ value, onChange, maxLabel = 'Very much' }: ScaleRatingProps) {
    return (
        <div className="w-full">
            <div className="scale-container">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        type="button"
                        className={`scale-btn ${value === num ? 'selected' : ''}`}
                        onClick={() => onChange(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <p className="text-muted text-right mt-2 text-xs">{maxLabel}</p>
        </div>
    )
}
