import React, {useState, useEffect} from 'react';
import styles from './ModalCalendar.module.scss';
import classes from "../ModalsProjects/ModalsProjects.module.scss";

interface Task {
    id: string | number;
    description: string;
    title: string;
    status: number;
    material: string;
    notice: string;
    start_date: string;
    end_date: string;
}

interface ModalCalendarProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (startDate: Date | null, endDate: Date | null) => void;
    tasks: Task[];
    selectedTaskId: string | number | null;
}

const ModalCalendar: React.FC<ModalCalendarProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onApply,
                                                         tasks,
                                                         selectedTaskId,
                                                     }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (selectedTaskId) {
            const task = tasks.find(task => task.id === selectedTaskId);
            if (task) {
                setSelectedStartDate(task.start_date ? new Date(task.start_date) : null);
                setSelectedEndDate(task.end_date ? new Date(task.end_date) : null);
            }
        }
    }, [selectedTaskId, tasks]);

    if (!isOpen) return null;

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 0).getDay();
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(clickedDate);
            setSelectedEndDate(null);
        } else {
            if (clickedDate < selectedStartDate) {
                setSelectedStartDate(clickedDate);
                setSelectedEndDate(selectedStartDate);
            } else {
                setSelectedEndDate(clickedDate);
            }
        }
    };

    const isDateInRange = (day: number) => {
        if (!selectedStartDate || !selectedEndDate) return false;

        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        return date > selectedStartDate && date < selectedEndDate;
    };

    const isDateSelected = (day: number) => {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        ).getTime();

        return (
            date === selectedStartDate?.getTime() ||
            date === selectedEndDate?.getTime()
        );
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const today = new Date().getDate(); // Получаем текущий день
        const currentMonth = new Date().getMonth(); // Текущий месяц
        const currentYear = new Date().getFullYear(); // Текущий год


        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className={styles.day}/>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                day === today &&
                currentDate.getMonth() === currentMonth &&
                currentDate.getFullYear() === currentYear; // Проверяем, совпадает ли день, месяц и год

            days.push(
                <div
                    key={day}
                    className={`${styles.day} ${
                        isToday ? styles.today : '' // Применяем стиль для текущего дня
                    } ${isDateSelected(day) ? styles.selected : ''} ${
                        isDateInRange(day) ? styles.inRange : ''
                    }`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };


    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const handleApply = () => {
        onApply(selectedStartDate, selectedEndDate);
    };

    const handleResetDates = () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.cleanButton} onClick={handleResetDates}>
                    Сбросить
                </button>

                <div className={styles.calendar}>
                    <div className={styles.header}>
                        <h2>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className={styles.navigation}>
                            <button onClick={handlePrevMonth}>
                                ▲
                            </button>
                            <button onClick={handleNextMonth}>
                                ▼
                            </button>
                        </div>
                    </div>

                    <div className={styles.weekdays}>
                        {weekDays.map((day, index) => (
                            <div
                                key={day}
                                className="text-center font-medium text-sm py-1"
                                style={{
                                    color: index >= 5 ? 'red' : 'inherit'
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className={styles.days}>{renderCalendar()}</div>
                </div>
                <div className={classes.divider}/>
                <div className={styles.footer}>
                    <button className={styles.cancel} onClick={onClose}>
                        Отмена
                    </button>
                    <button className={styles.apply} onClick={handleApply}>
                        ОК
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCalendar;
