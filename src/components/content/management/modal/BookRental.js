import { useState, useEffect } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Calendar, Modal, Button, message } from 'antd';

import axios from 'axios';
import dayjs from 'dayjs';

import './css/BookRental.css';

const BookRental = ({ bookData }) => {
  const { user } = useUser();

  const { _id, name } = user;

  const [mode, setMode] = useState('month');
  const [value, setValue] = useState(dayjs());
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [bookHistory, setBookHistory] = useState([]);
  const [bookStartDate, setBookStartDate] = useState(null);
  const [bookEndDate, setBookEndDate] = useState(null);

  const isMonthMode = mode === 'month';
  const isBookRental = bookStartDate && bookEndDate;

  const handlePanelChange = (value, mode) => {
    setMode(mode);
    setValue(value);
    setBookStartDate(null);
    setBookEndDate(null);

    mode === 'month' && handleBookHistory(value);
  };

  const handleCellRender = (calendarDate) => {
    const isToday = calendarDate.isSame(dayjs(), isMonthMode ? 'day' : 'month');
    const isStart = bookStartDate && calendarDate.isSame(bookStartDate, 'day');
    const isEnd = bookEndDate && calendarDate.isSame(bookEndDate, 'day');
    const isRange =
      isBookRental &&
      calendarDate.isAfter(bookStartDate, 'day') &&
      calendarDate.isBefore(bookEndDate, 'day');

    const className = `${isStart ? 'start-date' : isEnd ? 'end-date' : isRange ? 'range-date' : ''} ${isToday ? 'today' : ''}`;

    return (
      <div
        className={`calendar-cell ${className}`}
        onClick={() => handleCalendarSelect(calendarDate)}
      >
        <div className="calendar-date">
          {isMonthMode ? calendarDate.format('DD') : calendarDate.format('MMM')}
        </div>
        <div className="calendar-content"></div>
      </div>
    );
  };

  const handleBookHistory = async (value) => {
    const firstDayOfMonth = value?.startOf('month') || dayjs().startOf('month');
    const lastDayOfMonth = value?.endOf('month') || dayjs().endOf('month');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/management/bookHistory/${bookData._id}`
      );

      const filteredHistory = response.data.filter(
        (event) =>
          (dayjs(event.startDate).isSame(firstDayOfMonth, 'day') ||
            dayjs(event.startDate).isAfter(firstDayOfMonth, 'day')) &&
          (dayjs(event.endDate).isSame(lastDayOfMonth, 'day') ||
            dayjs(event.endDate).isBefore(lastDayOfMonth, 'day'))
      );

      const sortedBookHistory = filteredHistory.sort((a, b) => {
        const startDateDiff = dayjs(a.startDate)
          .startOf('day')
          .diff(dayjs(b.startDate).startOf('day'));

        if (startDateDiff !== 0) return startDateDiff;

        const durationA = dayjs(a.endDate).diff(dayjs(a.startDate));
        const durationB = dayjs(b.endDate).diff(dayjs(b.startDate));

        return durationB - durationA;
      });

      setValue(value || dayjs());
      setBookHistory(sortedBookHistory);
      setBookStartDate(null);
      setBookEndDate(null);

      handleCalendarWeeks(firstDayOfMonth);
    } catch (error) {
      message.error('도서 대여 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleCalendarWeeks = (firstDayOfMonth) => {
    const cells = document.querySelectorAll('.ant-picker-cell');

    let week = [];
    const weeks = [];

    const firstDayOfWeekIndex = firstDayOfMonth.day();
    const prevLastDayOfMonth = firstDayOfMonth.subtract(1, 'month').endOf('month');

    Array.from(cells).forEach((cell, index) => {
      const date =
        index < firstDayOfWeekIndex
          ? prevLastDayOfMonth.subtract(firstDayOfWeekIndex - index - 1, 'day')
          : firstDayOfMonth.add(index - firstDayOfWeekIndex, 'day');

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
        date,
      });
    });

    if (week.length) {
      weeks.push(week);
      week = [];
    }

    setCalendarWeeks(weeks);
  };

  const handleEventRender = () => {
    let levelEventMap = [];

    bookHistory.forEach((event) => {
      const startDate = dayjs(event.startDate);
      const endDate = dayjs(event.endDate);

      let eventLevel;

      for (let level = 0; level <= levelEventMap.length; level++) {
        const isOverlap = levelEventMap.some(({ event: prevEvent, level: prevLevel }) => {
          const prevStartDate = dayjs(prevEvent.startDate);
          const prevEndDate = dayjs(prevEvent.endDate);

          return (
            level === prevLevel &&
            (startDate.isSame(prevEndDate, 'day') ||
              (startDate.isBefore(prevEndDate, 'day') && endDate.isAfter(prevStartDate, 'day')) ||
              endDate.isSame(prevStartDate, 'day'))
          );
        });

        if (!isOverlap) {
          eventLevel = level;
          break;
        }
      }

      levelEventMap.push({
        event,
        level: eventLevel,
      });
    });

    const bookEventComponent = levelEventMap.map(({ event, level }) => {
      const startDate = dayjs(event.startDate);
      const endDate = dayjs(event.endDate);

      const eventWeeks = calendarWeeks.filter((week) =>
        week.some(
          (day) =>
            (day.date.isSame(startDate, 'day') || day.date.isAfter(startDate, 'day')) &&
            (day.date.isSame(endDate, 'day') || day.date.isBefore(endDate, 'day'))
        )
      );

      const eventContent = eventWeeks.map((week, index) => {
        const firstDay =
          week.find((day) => day.date.isSame(startDate, 'day')) ||
          week.find((day) => day.isFirstDayOfWeek);
        const lastDay =
          week.find((day) => day.date.isSame(endDate, 'day')) ||
          week.find((day) => day.isLastDayOfWeek);

        const eventWidth = lastDay.left - firstDay.left + firstDay.width;

        const className = event.user === _id ? 'active' : '';

        return (
          firstDay && (
            <div
              className={`event ${className}`}
              key={`${event._id}-${index}`}
              style={{
                top: firstDay.top + level * 30 + 30,
                left: firstDay.left,
                width: eventWidth,
              }}
            >
              {event.registeredBy}
            </div>
          )
        );
      });

      return eventContent;
    });

    return bookEventComponent;
  };

  const handleCalendarSelect = (date) => {
    const minDays = 1;
    const maxDays = 14;

    const [start, end] = isMonthMode
      ? !bookStartDate
        ? [date, null]
        : !bookEndDate
          ? !date.isSame(bookStartDate, 'day')
            ? date.isAfter(bookStartDate, 'day')
              ? date.diff(bookStartDate, 'day') >= minDays &&
                date.diff(bookStartDate, 'day') <= maxDays
                ? [bookStartDate, date]
                : [bookStartDate, null]
              : [date, null]
            : [null, null]
          : [date, null]
      : [null, null];

    isMonthMode
      ? (setValue(start || dayjs()), setBookStartDate(start), setBookEndDate(end))
      : setValue((prevDate) => (prevDate?.isSame(date, 'month') ? dayjs() : date));
  };

  const handleBookRental = async () => {
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

            handleBookHistory();
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
    handleBookHistory();
  }, []);

  return (
    <div className="bookRental-container">
      <h2>도서 대여</h2>
      <div className="bookRental-form">
        <Calendar
          mode={mode}
          value={value}
          onPanelChange={handlePanelChange}
          fullCellRender={handleCellRender}
        />
        {isMonthMode && <div className="bookEvent-content">{handleEventRender()}</div>}
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
