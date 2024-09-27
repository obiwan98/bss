import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Button, Calendar, Modal, message } from 'antd';

import axios from 'axios';
import dayjs from 'dayjs';

import './css/BookRental.css';

const BookRental = ({ bookData }) => {
  const { user } = useUser();

  const { history } = bookData;

  const [mode, setMode] = useState('month');
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(null);
  const [bookStartDate, setBookStartDate] = useState(null);
  const [bookEndDate, setBookEndDate] = useState(null);

  const calendarContentRef = useRef(null);

  const today = dayjs();

  const isMonthMode = mode === 'month';
  const isBookRental = bookStartDate && bookEndDate;

  const handlePanelChange = (_, mode) => setMode(mode);

  const handleCalendarWeeks = () => {
    const cells = document.querySelectorAll('.ant-picker-cell');

    let week = [];
    const weeks = [];

    Array.from(cells).forEach((cell, index) => {
      if (index % 7 === 0 && week.length) {
        weeks.push(week);
        week = [];
      }

      week.push({
        top: cell.offsetTop,
        left: cell.offsetLeft + 12,
        width: cell.offsetWidth - 24,
        isFirstDayOfWeek: index % 7 === 0,
        isLastDayOfWeek: index % 7 === 6,
        date: dayjs().startOf('month').add(index, 'day').format('YYYY-MM-DD'),
      });
    });

    if (week.length) {
      weeks.push(week);
      week = [];
    }

    setCalendarWeeks(weeks);
  };

  const handleCellRender = (calendarDate) => {
    const isToday = calendarDate.isSame(today, 'day');
    const isStart = bookStartDate && calendarDate.isSame(bookStartDate, 'day');
    const isEnd = bookEndDate && calendarDate.isSame(bookEndDate, 'day');
    const isRange =
      isBookRental &&
      calendarDate.isAfter(bookStartDate, 'day') &&
      calendarDate.isBefore(bookEndDate, 'day');

    const className = `${isStart ? 'start-date' : isEnd ? 'end-date' : isRange ? 'range-date' : ''} ${isToday ? 'today' : ''}`;

    return (
      <div className={`calendar-cell ${className}`}>
        <div className="calendar-date">
          {isMonthMode ? calendarDate.format('DD') : calendarDate.format('MMM')}
        </div>
        <div className="calendar-content" ref={calendarContentRef}></div>
      </div>
    );
  };

  const handleEventRender = () => {
    return history.map((event) => {
      const startDate = dayjs(event.startDate).format('YYYY-MM-DD');
      const endDate = dayjs(event.endDate).format('YYYY-MM-DD');

      const eventWeeks = calendarWeeks.filter((week) =>
        week.some((day) => startDate <= day.date && day.date <= endDate)
      );

      return eventWeeks.map((week, weekIndex) => {
        const firstDay =
          week.find((day) => day.date === startDate) || week.find((day) => day.isFirstDayOfWeek);
        const lastDay =
          week.find((day) => day.date === endDate) || week.find((day) => day.isLastDayOfWeek);

        const eventWidth = lastDay.left - firstDay.left + firstDay.width;

        return (
          firstDay && (
            <div
              className="event"
              key={`${event._id}-${weekIndex}`}
              style={{
                top: firstDay.top + 30,
                left: firstDay.left,
                width: eventWidth,
              }}
            >
              {event.registeredBy}
            </div>
          )
        );
      });
    });
  };

  const handleCalendarSelect = (date) => {
    const minDays = 1;
    const maxDays = 14;

    const [start, end] = isMonthMode
      ? !bookStartDate
        ? [date, null]
        : !bookEndDate
          ? !date.isSame(bookStartDate, 'day')
            ? date.isAfter(bookStartDate)
              ? date.diff(bookStartDate, 'day') >= minDays &&
                date.diff(bookStartDate, 'day') <= maxDays
                ? [bookStartDate, date]
                : [bookStartDate, null]
              : [date, null]
            : [null, null]
          : [date, null]
      : [null, null];

    isMonthMode
      ? (setBookStartDate(start), setBookEndDate(end))
      : setCalendarMonth((prevCalendarMonth) =>
          prevCalendarMonth?.isSame(date, 'month') ? null : date
        );
  };

  const handleBookRental = async () => {
    const { _id, name } = user;

    Modal.confirm({
      title: '도서를 대여하시겠습니까?',
      content: `대여 기간: ${dayjs(bookStartDate).format('YYYY-MM-DD')} ~ ${dayjs(bookEndDate).format('YYYY-MM-DD')}`,
      okType: 'primary',
      okText: '확인',
      cancelText: '취소',
      onOk() {
        axios
          .put(`${process.env.REACT_APP_API_URL}/api/management/bookHistory/${bookData._id}`, {
            user: _id,
            startDate: bookStartDate,
            endDate: bookEndDate,
            registeredBy: name,
          })
          .then(() => {
            message.success('도서를 대여하였습니다.');
          })
          .catch((error) => {
            console.error('도서 대여를 실패하였습니다.');
          });
      },
      onCancel() {
        message.info('도서 대여를 취소하였습니다.');
      },
    });
  };

  useEffect(() => {
    isMonthMode && handleCalendarWeeks();
  }, [isMonthMode]);

  return (
    <div className="bookRental-container">
      <h2>도서 대여</h2>
      <div className="bookRental-form">
        <Calendar
          mode={mode}
          value={(isMonthMode && bookStartDate) || calendarMonth || today}
          onPanelChange={handlePanelChange}
          fullCellRender={handleCellRender}
          onSelect={handleCalendarSelect}
        />
        <div className="bookEvent-content">{isMonthMode && handleEventRender()}</div>
        {isBookRental && (
          <Button type="primary" onClick={handleBookRental}>
            신청
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookRental;
