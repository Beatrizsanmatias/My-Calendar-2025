import {
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Calendar.css";

interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  time: string;
  color: string;
  notification: boolean;
  notified?: boolean;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    color: "#3b82f6",
    notification: false,
  });

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Yellow", value: "#fbec5d" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Pink", value: "#ec4899" },
    { name: "Red", value: "#ef4444" },
    { name: "Burgundy", value: "#660033" },
    { name: "Dark Grey", value: "#353E43" },
  ];

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      events.forEach((event) => {
        if (event.notification && !event.notified) {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          const timeDiff = eventDateTime.getTime() - now.getTime();

          if (timeDiff > 0 && timeDiff <= 300000) {
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Event Reminder", {
                body: `${event.title} starts in 5 minutes!`,
                icon: "📅",
              });
            }

            setEvents((prev) =>
              prev.map((e) =>
                e.id === event.id ? { ...e, notified: true } : e
              )
            );
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = getDateString(day);
    return events.filter((e) => e.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert("Please enter a title, start time, and end time.");
      return;
    }

    const event: CalendarEvent = {
      id: Date.now(),
      date: getDateString(selectedDate!),
      title: newEvent.title,
      time: `${newEvent.startTime} - ${newEvent.endTime}`,
      color: newEvent.color,
      notification: newEvent.notification,
      notified: false,
    };

    setEvents((prev) => [...prev, event]);
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      color: "#3b82f6",
      notification: false,
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <div className="calendar-card">
          {/* Header */}
          <div className="calendar-header">
            <h1 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="calendar-nav">
              <button onClick={() => navigateMonth(-1)} className="nav-button">
                <ChevronLeft className="nav-icon" />
              </button>
              <button onClick={() => navigateMonth(1)} className="nav-button">
                <ChevronRight className="nav-icon" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}

            {[...Array(startingDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const today = isToday(day);

              const firstEventColor =
                dayEvents.length > 0 ? dayEvents[0].color : "transparent";

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`day-cell ${today ? "today" : ""}`}
                  style={{
                    backgroundColor:
                      firstEventColor !== "transparent"
                        ? `${firstEventColor}20`
                        : "transparent",
                    border:
                      dayEvents.length > 0
                        ? `2px solid ${firstEventColor}`
                        : "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    className={`day-number ${today ? "today-number" : ""}`}
                    style={{ color: today ? "#fff" : "#111827" }}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  Events for {monthNames[currentDate.getMonth()]} {selectedDate}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="close-button"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="event-list">
                {getEventsForDay(selectedDate!).map((event) => (
                  <div
                    key={event.id}
                    className="event-item"
                    style={{ backgroundColor: `${event.color}20` }}
                  >
                    <div className="event-info">
                      <div
                        className="event-title"
                        style={{ color: event.color }}
                      >
                        {event.title}
                      </div>
                      <div className="event-time">
                        {event.time}
                        {event.notification && (
                          <Bell className="bell-icon-small" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="delete-button"
                    >
                      <X className="delete-icon" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="event-form">
                <input
                  type="text"
                  placeholder="Insert Event Name"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="form-input"
                />
                <div className="time-inputs">
                  <label className="time-label">
                    Start Time
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, startTime: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </label>

                  <label className="time-label">
                    End Time
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endTime: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </label>
                </div>

                <div className="color-section">
                  <label>Choose Color</label>
                  <div className="color-options">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          setNewEvent({ ...newEvent, color: color.value })
                        }
                        className={`color-button ${
                          newEvent.color === color.value ? "selected" : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setNewEvent({
                      ...newEvent,
                      notification: !newEvent.notification,
                    })
                  }
                  className={`notification-toggle ${
                    newEvent.notification ? "enabled" : "disabled"
                  }`}
                >
                  {newEvent.notification ? (
                    <>
                      <Bell className="bell-icon" />
                      Notification Enabled
                    </>
                  ) : (
                    <>
                      <BellOff className="bell-icon" />
                      Enable Notification
                    </>
                  )}
                </button>

                <button onClick={handleAddEvent} className="add-button">
                  <Plus className="plus-icon" />
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
