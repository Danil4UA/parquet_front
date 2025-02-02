// Select.tsx
"use client"
import React, { useState, useRef, useEffect } from 'react'
import { classNames } from "@/shared/lib/classNames/classNames"
import ArrowIcon from "@/app/assets/arrow.svg"
import './Select.css'

interface SelectProps {
    className?: string
    options: string[]
    placeholder?: string
    onChange?: (value: string) => void
}

const Select: React.FC<SelectProps> = ({
    options, 
    className, 
    placeholder = "Select an option",
    onChange
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const selectRef = useRef<HTMLDivElement>(null)

    const handleShowOptions = () => {
        setIsOpen(!isOpen)
    }

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option)
        setIsOpen(false)
        onChange?.(option)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div 
            ref={selectRef}
            className={classNames('select', 
                { 
                    'select--open': isOpen 
                }, 
                [className]
            )}
        >
            <div 
                onClick={handleShowOptions}
                className="select__control"
            >
                <span className={`select__placeholder ${selectedOption ? 'select__placeholder--selected' : ''}`}>
                    {selectedOption || placeholder}
                </span>
                <div className={`select__arrow ${isOpen ? 'select__arrow--rotated' : ''}`}>
                    <ArrowIcon />
                </div>
            </div>
            <div className={`select__dropdown ${isOpen ? 'select__dropdown--open' : ''}`}>
                <ul className="select__options">
                    {options.map((option) => (
                        <li 
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className="select__option"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Select