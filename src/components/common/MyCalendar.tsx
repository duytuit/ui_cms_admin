import { useState, useRef, useEffect } from "react";
interface CalendarProps {
  value?: string | null; // trả về string
  onChange?: (date: string | null) => void;
  dateFormat?: string;
  showButtonBar?: boolean;
  className?: string;
}

export const MyCalendar = ({
  value,
  onChange,
  dateFormat = "dd/mm/yyyy",
  showButtonBar = true,
  className = "",
}: CalendarProps) => {

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  useEffect(() => {
    // Sync lại khi parent đổi value
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

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
    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      onChange?.(`${y}-${m}-${d}`);   // trả string yyyy-MM-dd
    } else {
      onChange?.(null);
    }
    setShowPopup(false);
  };

  return (
    <div className="custom-calendar" style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <div style={{ display: "block", position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={formatDate(selectedDate)}
          readOnly
          onClick={() => setShowPopup(!showPopup)}
          className={`calendar-input ${className}`}
          style={{ cursor: "pointer", border: "1px" }}
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
          onClose={() => setShowPopup(false)}
          showButtonBar={showButtonBar}
          className={`${className}-popup`}
          targetRef={inputRef}
        />
      )}
    </div>
  );
};
interface CalendarPopupProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  onClose: () => void; // 🟢 thêm prop
  showButtonBar?: boolean;
  className?: string;
  targetRef?: React.RefObject<HTMLInputElement>;
}

export const CalendarPopup = ({
  selectedDate,
  onSelectDate,
  onClose,
  showButtonBar = true,
  className = "",
  targetRef,
}: CalendarPopupProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement | null>(null);
  // 🟢 Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popupEl = popupRef.current;
      const targetEl = targetRef?.current;
      const clickedEl = event.target as Node | null;

      if (
        popupEl &&
        !popupEl.contains(clickedEl) &&
        targetEl &&
        !targetEl.contains(clickedEl)
      ) {
        onClose(); // 🟢 Gọi callback để đóng popup
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, targetRef]);
  // 📍 Đặt vị trí popup
useEffect(() => {
  if (targetRef?.current && popupRef.current?.offsetParent) {
    const inputEl = targetRef.current;
    const parentEl = popupRef.current.offsetParent as HTMLElement;
    const inputRect = inputEl.getBoundingClientRect();
    const parentRect = parentEl.getBoundingClientRect();

    // 🧭 Tính vị trí tương đối với container (MyCalendar)
    const top = inputRect.bottom - parentRect.top + 4;
    const left = inputRect.left - parentRect.left;

    setPosition({ top, left });
  }
}, [targetRef]);

  // 🗓 Sinh ngày
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  const prevMonth = (e:any) => {
    e.preventDefault();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = (e:any) => {
      e.preventDefault();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const handleToday = () => onSelectDate(today);
  const handleClose = () => onClose(); // 🟢 thay vì onSelectDate(selectedDate)

  return (
    <div
      ref={popupRef}
      className={`calendar-popup ${className}`}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        padding: 10,
        zIndex: 9999,
        minWidth: 220,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, gap: 5 }}>
        <button onClick={prevMonth}>{"<"}</button>
        <select value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m - 1}>
              {m}
            </option>
          ))}
        </select>
        <select value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button onClick={nextMonth}>{">"}</button>
      </div>

      {/* Days */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 30px)", gap: 2, justifyContent: "center" }}>
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

      {showButtonBar && (
        <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleToday}>Today</button>
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
};