import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface CalendarProps {
  value?: string | null;
  onChange?: (date: string | null) => void;
  dateFormat?: string;
  className?: string;
}

export const MyCalendar = ({
  value,
  onChange,
  dateFormat = "dd/mm/yyyy",
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

    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    switch (dateFormat.toLowerCase()) {
      case "dd/mm/yyyy":
        return `${d}/${m}/${y}`;
      case "mm/dd/yyyy":
        return `${m}/${d}/${y}`;
      case "yyyy-mm-dd":
        return `${y}-${m}-${d}`;
      default:
        return `${d}/${m}/${y}`;
    }
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
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [arrowLeft, setArrowLeft] = useState(20);

  const ref = useRef<HTMLDivElement>(null);

  // 🔥 POSITION LOGIC
  useEffect(() => {
    const update = () => {
      if (!anchorRef.current || !ref.current) return;

      const rect = anchorRef.current.getBoundingClientRect();
      const popup = ref.current;

      const popupW = popup.offsetWidth;
      const popupH = popup.offsetHeight;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top = 0;
      let left = rect.left;

      // flip top/bottom
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < popupH && spaceAbove > popupH) {
        top = rect.top - popupH - 8;
        setPlacement("top");
      } else {
        top = rect.bottom + 8;
        setPlacement("bottom");
      }

      // tránh tràn ngang
      if (left + popupW > vw - 8) left = vw - popupW - 8;
      if (left < 8) left = 8;

      // arrow
      const arrow = rect.left + rect.width / 2 - left;
      setArrowLeft(arrow);

      setPos({ top, left });
    };

    update();

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [anchorRef]);

  // click ngoài
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

  const isSelected = (d: number) =>
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
        zIndex: 9999,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 6,
        padding: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        visibility: pos.top === 0 ? "hidden" : "visible",
      }}
    >
      {/* arrow */}
      <div
        style={{
          position: "absolute",
          left: arrowLeft,
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          ...(placement === "bottom"
            ? { top: -6, borderBottom: "6px solid #fff" }
            : { bottom: -6, borderTop: "6px solid #fff" }),
        }}
      />

      {/* header */}
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

      {/* days */}
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
              background: isSelected(d)
                ? "#3f51b5"
                : isToday(d)
                ? "#eee"
                : "transparent",
              color: isSelected(d) ? "#fff" : "#000",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* footer */}
      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => onSelect(today)}>Today</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};