import { useEffect, useState } from 'react';
import { useUser } from '../../../../contexts/UserContext';

import { Button, Calendar, message, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import useFetchRolesAndGroups from '../../../../hooks/useFetchRolesAndGroups';
import { sendEmail } from '../../../../utils/api';

import './css/BookRental.css';

const BookRental = ({ bookData }) => {
  const { user } = useUser();

  const { _id, name } = user;

  const [value, setValue] = useState(dayjs());
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [isAlreadyRented, setIsAlreadyRented] = useState(false);
  const [bookHistory, setBookHistory] = useState([]);
  const [bookStartDate, setBookStartDate] = useState(null);
  const [bookEndDate, setBookEndDate] = useState(null);

  const isBookRental = bookStartDate && bookEndDate;

  const { groups } = useFetchRolesAndGroups();

  const handlePanelChange = (value) => {
    value.isBefore(dayjs(), 'day') && (setBookStartDate(null), setBookEndDate(null));

    setValue(value);

    handleBookHistory(value);
  };

  const handleCellRender = (calendarDate) => {
    const isToday = calendarDate.isSame(dayjs(), 'day');
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
        <div className="calendar-date">{calendarDate.format('DD')}</div>
        <div className="calendar-content"></div>
      </div>
    );
  };

  const handleBookHistory = async (value) => {
    const firstDayOfMonth = value?.startOf('month') || dayjs().startOf('month');
    const firstDayOfCalendar = firstDayOfMonth.startOf('week');

    const lastDayOfCalendar = firstDayOfCalendar.add(5, 'week').endOf('week');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/management/bookHistory/${bookData._id}`
      );

      const rentedBookHistory = !!response.data.find(
        (item) => item.user === _id && item.state !== 2
      );

      const filteredHistory = response.data.filter(
        (event) =>
          (dayjs(event.startDate).isSame(lastDayOfCalendar, 'day') ||
            dayjs(event.startDate).isBefore(lastDayOfCalendar, 'day')) &&
          (dayjs(event.endDate).isSame(firstDayOfCalendar, 'day') ||
            dayjs(event.endDate).isAfter(firstDayOfCalendar, 'day'))
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
      setIsAlreadyRented(rentedBookHistory);
      setBookHistory(sortedBookHistory);

      handleCalendarWeeks(firstDayOfCalendar);
    } catch (error) {
      message.error('도서 대여 정보를 가져오는데 실패하였습니다.');
    }
  };

  const handleCalendarWeeks = (firstDayOfCalendar) => {
    const cells = document.querySelectorAll('.ant-picker-cell');

    let week = [];
    const weeks = [];

    Array.from(cells).forEach((cell, index) => {
      const date = firstDayOfCalendar.add(index, 'day');

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
        const className = event.user !== _id ? 'nonSelf' : 'self';

        const firstDay =
          week.find((day) => day.date.isSame(startDate, 'day')) ||
          week.find((day) => day.isFirstDayOfWeek);
        const lastDay =
          week.find((day) => day.date.isSame(endDate, 'day')) ||
          week.find((day) => day.isLastDayOfWeek);

        const isFirstDay = firstDay.date.isSame(startDate, 'day');
        const isLastDay = lastDay.date.isSame(endDate, 'day');

        const eventWidth = lastDay.left - firstDay.left + firstDay.width;

        let eventStyle = {
          top: firstDay.top + level * 30 + 30,
          left: firstDay.left,
          width: eventWidth,
        };

        const eventType = `${isFirstDay}-${isLastDay}`;

        switch (eventType) {
          case 'true-false':
            eventStyle = {
              ...eventStyle,
              width: eventWidth + 8,
            };
            break;

          case 'false-true':
            eventStyle = {
              ...eventStyle,
              left: firstDay.left - 8,
              width: eventWidth + 8,
            };
            break;

          case 'false-false':
            eventStyle = {
              ...eventStyle,
              left: firstDay.left - 8,
              width: eventWidth + 16,
            };
            break;

          default:
            eventStyle = { ...eventStyle };
            break;
        }

        return (
          firstDay && (
            <div className={`event ${className}`} key={`${event._id}-${index}`} style={eventStyle}>
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
    if (isAlreadyRented || date.isBefore(dayjs(), 'day')) return false;

    const minDays = 1;
    const maxDays = 14;

    const [start, end] = !bookStartDate
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
        : [date, null];

    setValue(start || dayjs());
    setBookStartDate(start);
    setBookEndDate(end);

    !start && handleBookHistory();
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
          .then((response) => {
            message.success(response.data.message);

            // Send-mail 예비 로직
            if (response.status === 200) {
              // 도서 정보
              const group = groups.find((group) => group._id === bookData.group);
              if (!group) {
                console.error('해당 그룹을 찾을 수 없습니다.');
                return;
              }
              const bookInfo = {
                title: `${bookData.title}`,
                ownTeam : `${group.team}`,
                requestDetails: `${dayjs(bookStartDate).format('YYYY-MM-DD')} ~ ${dayjs(bookEndDate).format('YYYY-MM-DD')}`,
              };
              sendEmail('rentalRequest', user, bookInfo, -1, '');
            }
            setBookStartDate(null);
            setBookEndDate(null);

            handleBookHistory();
          })
          .catch((error) => {
            message.error(error.response.data.message);

            setValue(dayjs());
            setBookStartDate(null);
            setBookEndDate(null);
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
          value={value}
          onPanelChange={handlePanelChange}
          fullCellRender={handleCellRender}
        />
        <div className="bookEvent-content">{handleEventRender()}</div>
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
