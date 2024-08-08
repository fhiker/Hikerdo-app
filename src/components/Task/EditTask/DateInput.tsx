import type React from 'react';
import { useState, useEffect, type ChangeEvent } from 'react';

interface Props {
    inputDate: string | undefined;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const DateInput: React.FC<Props> = ({ inputDate, handleChange }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');

    useEffect(() => {
        if (inputDate) {
            const date = new Date(inputDate);
            setSelectedDate(date.toISOString().split('T')[0]);
        } else {
            setSelectedDate('');
        }
    }, [inputDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        if (newDate) {
            handleChange(e)
        }

    };

    return (
        <div className="date-input-container">
            <input
                aria-label='date-input'
                type="date"
                value={selectedDate ? selectedDate : ''}
                name='dueAt'
                onChange={handleDateChange}
                className='dark:bg-neutral'
            />
        </div>
    );
};