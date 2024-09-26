import { useState, useEffect } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Button, Calendar, Modal, message } from 'antd';

import axios from 'axios';
import dayjs from 'dayjs';

import './css/BookRental.css';

const BookRental = ({ bookData }) => {
  const { user } = useUser();

  const { history } = bookData;

  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [bookStartDate, setBookStartDate] = useState(null);
  const [bookEndDate, setBookEndDate] = useState(null);

  const today = dayjs();

  /* const handlePanelChange = () => {
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
        left: cell.offsetLeft,
        width: cell.offsetWidth,
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
  }; */

  /* const handleRenderEvent = () => {
    return history.map((event, index) => {
      const startDate = dayjs(event.startDate).format('YYYY-MM-DD');
      const endDate = dayjs(event.endDate).format('YYYY-MM-DD');

      const eventWeeks = calendarWeeks.filter((week) =>
        week.some((day) => startDate <= day.date && day.date <= endDate)
      );

      return eventWeeks.map((week) => {
        const firstDay =
          week.find((day) => day.date === startDate) || week.find((day) => day.isFirstDayOfWeek);
        const lastDay =
          week.find((day) => day.date === endDate) || week.find((day) => day.isLastDayOfWeek);

        const eventWidth = lastDay.left - firstDay.left + firstDay.width;

        return (
          firstDay && (
            <div
              className="event"
              key={`${event._id}-${index}`}
              style={{
                position: 'absolute',
                padding: '2px 5px',
                top: firstDay.top + index * 30 + 30,
                left: firstDay.left,
                width: eventWidth,
                backgroundColor: '#ffe6e6',
                borderRadius: '4px',
                zIndex: 2,
              }}
            >
              {event.registeredBy}
            </div>
          )
        );
      });
    });
  }; */

  const handleCellRender = (calendarDate) => {
    const isStart = bookStartDate && calendarDate.isSame(bookStartDate, 'day');
    const isEnd = bookEndDate && calendarDate.isSame(bookEndDate, 'day');
    const isRange =
      bookStartDate &&
      bookEndDate &&
      calendarDate.isAfter(bookStartDate, 'day') &&
      calendarDate.isBefore(bookEndDate, 'day');

    const className = isStart ? 'start-date' : isEnd ? 'end-date' : isRange ? 'range-date' : '';

    return (
      <div className={`calendar-cell ${className}`}>
        <div className="calendar-date">{calendarDate.format('DD')}</div>
        <div className="calendar-content"></div>
      </div>
    );
  };

  const handleCalendarSelect = (date) => {
    const minDays = 1;
    const maxDays = 14;

    const [start, end] = !bookStartDate
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
        : [date, null];

    setBookStartDate(start);
    setBookEndDate(end);
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
    // handlePanelChange();
    /* window.addEventListener('resize', handlePanelChange);

    return () => {
      window.removeEventListener('resize', handlePanelChange);
    }; */
  }, []);

  return (
    <div className="bookRental-container">
      <h2>도서 대여</h2>
      <div className="bookRental-form">
        <Calendar
          value={bookStartDate || today}
          fullCellRender={handleCellRender}
          onSelect={handleCalendarSelect}
        />
        {bookStartDate && bookEndDate && (
          <Button type="primary" onClick={handleBookRental}>
            신청
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookRental;
