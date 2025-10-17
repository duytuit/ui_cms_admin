import { useState, useRef, useEffect } from "react";

interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  dateFormat?: string;
  showButtonBar?: boolean;
  className?: string; // thêm prop
}

export const MyCalendar = ({
  value,
  onChange,
  dateFormat = "dd/mm/yyyy",
  showButtonBar = true,
  className = "", // default rỗng
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date);
    setShowPopup(false);
  };

  return (
    <div className={`custom-calendar`} style={{ position: "relative", display: "inline-block" }}>
      <div style={{ display: "block", position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={formatDate(selectedDate)}
          readOnly
          onClick={() => setShowPopup(!showPopup)}
          className={`calendar-input ${className}`}
          style={{ cursor: "pointer" }}
        />
        <span
          style={{ marginLeft: -25, cursor: "pointer" }}
          onClick={() => setShowPopup(!showPopup)}
        >
          📅
        </span>
      </div>

      {showPopup && (
        <CalendarPopup
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
          showButtonBar={showButtonBar}
          className={`${className}-popup`}
        />
      )}
    </div>
  );
};
interface CalendarPopupProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  showButtonBar?: boolean;
  className?: string; // thêm prop
}

export const CalendarPopup = ({
  selectedDate,
  onSelectDate,
  showButtonBar = true,
  className = "",
}: CalendarPopupProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  const handleToday = () => onSelectDate(today);
  const handleClear = () => onSelectDate(null);
  const handleClose = () => onSelectDate(selectedDate);

  return (
    <div
      className={`calendar-popup ${className}`}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        border: "1px solid #ccc",
        background: "#fff",
        padding: 10,
        zIndex: 1000,
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header: chọn tháng + năm */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
          gap: 5,
        }}
      >
        <button onClick={prevMonth}>{"<"}</button>

        <select
          value={currentMonth}
          onChange={(e) => setCurrentMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m - 1}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button onClick={nextMonth}>{">"}</button>
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 30px)",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {days.map((day) => {
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;

          return (
            <div
              key={day}
              onClick={() => onSelectDate(new Date(currentYear, currentMonth, day))}
              style={{
                textAlign: "center",
                padding: 4,
                cursor: "pointer",
                borderRadius: "3px",
                backgroundColor: isSelected ? "#3f51b5" : isToday ? "#eee" : "transparent",
                color: isSelected ? "#fff" : "#000",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Button bar */}
      {showButtonBar && (
        <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleToday}>Today</button>
          {/* <button onClick={handleClear}>Clear</button> */}
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
};