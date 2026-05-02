import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface CalendarProps {
  value?: string | null;
  onChange?: (date: string | null) => void;
  dateFormat?: string; // ✅ bắt buộc có
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
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleSelect = (date: Date | null) => {
    setSelectedDate(date);

    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      onChange?.(`${y}-${m}-${d}`);
    } else {
      onChange?.(null);
    }

    setOpen(false);
  };

  return (
    <>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          ref={inputRef}
          value={formatDate(selectedDate)}
          readOnly
          onClick={() => setOpen(true)}
          className={className}
        />
          <span
          style={{ marginLeft: -25, cursor: "pointer" }}
          onClick={() => setOpen(true)}
        >
          📅
        </span>
      </div>

      {open &&
        createPortal(
          <CalendarPopup
            anchorRef={inputRef}
            selectedDate={selectedDate}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />,
          document.body
        )}
    </>
  );
};
interface PopupProps {
  anchorRef: React.RefObject<HTMLInputElement>;
  selectedDate: Date | null;
  onSelect: (date: Date | null) => void;
  onClose: () => void;
}

const CalendarPopup = ({
  anchorRef,
  selectedDate,
  onSelect,
  onClose,
}: PopupProps) => {
  const today = new Date();

  const [month, setMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth()
  );
  const [year, setYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear()
  );

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // 🔥 Position chuẩn + follow scroll
  useEffect(() => {
    const update = () => {
      if (!anchorRef.current) return;

      const rect = anchorRef.current.getBoundingClientRect();

      setPos({
        top: rect.bottom + 6,
        left: rect.left,
      });
    };

    update();

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [anchorRef]);

  // 🔥 click outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSame = (d: number) =>
    selectedDate &&
    d === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  const isToday = (d: number) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        background: "#fff",
        border: "1px solid #ddd",
        padding: 10,
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: 6,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, gap: 5 }}>
        <button onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}>
          {"<"}
        </button>

        <select value={month} onChange={(e) => setMonth(+e.target.value)}>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {i + 1}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(+e.target.value)}>
          {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}>
          {">"}
        </button>
      </div>

      {/* Days */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 32px)",
          gap: 4,
          marginTop: 8,
        }}
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <div
            key={d}
            onClick={() => onSelect(new Date(year, month, d))}
            style={{
              textAlign: "center",
              padding: 6,
              cursor: "pointer",
              borderRadius: 4,
              background: isSame(d)
                ? "#3f51b5"
                : isToday(d)
                ? "#eee"
                : "transparent",
              color: isSame(d) ? "#fff" : "#000",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => onSelect(today)}>Today</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};