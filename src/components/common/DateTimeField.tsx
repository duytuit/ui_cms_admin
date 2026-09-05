import { useEffect, useRef, useState } from "react";
import { classNames } from "primereact/utils";

const formatDateTimeDisplay = (value?: string | null) => {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(trimmed)) {
    const [date, time] = trimmed.split("T");
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year} ${time.slice(0, 5)}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed.split("-").reverse().join("/")}`;
  }

  return trimmed;
};

const formatManualDateTime = (input: string) => {
  const digits = input.replace(/\D/g, "").slice(0, 12);

  let formatted = "";
  if (digits.length > 0) formatted += digits.slice(0, 2);
  if (digits.length > 2) formatted += "/" + digits.slice(2, 4);
  if (digits.length > 4) formatted += "/" + digits.slice(4, 8);
  if (digits.length > 8) formatted += " " + digits.slice(8, 10);
  if (digits.length > 10) formatted += ":" + digits.slice(10, 12);

  return formatted;
};

const parseDisplayDateTime = (value?: string | null) => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const matched = trimmed.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?\s*$/);
  if (!matched) {
    const iso = trimmed.match(/^\s*(\d{4})-(\d{1,2})-(\d{1,2})[T\s](\d{1,2}):?(\d{2})?(?::\d{2})?\s*$/);
    if (!iso) return null;

    const [, year, month, day, hour, minute] = iso;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour || 0), Number(minute || 0));
  }

  const [, day, month, year, hour, minute] = matched;
  const hourValue = Number(hour || 0);
  const minuteValue = Number(minute || 0);
  return new Date(Number(year), Number(month) - 1, Number(day), hourValue, minuteValue);
};

const formatDateFromDate = (date: Date) => {
  const y = String(date.getFullYear()).padStart(4, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:00`;
};

const isCompleteManualDateTime = (value: string) =>
  /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(value);

export const DateTimeField = ({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => {
  const [text, setText] = useState(formatDateTimeDisplay(value));
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const parsed = parseDisplayDateTime(value);
    return parsed ?? new Date();
  });
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextValue = formatDateTimeDisplay(value);
    setText(nextValue);

    const parsed = parseDisplayDateTime(value);
    if (parsed) {
      setSelectedDate(parsed);
      setMonth(parsed.getMonth());
      setYear(parsed.getFullYear());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const applySelectedDate = (date: Date) => {
    const finalValue = formatDateFromDate(date);
    setText(finalValue);
    onChange(finalValue);
  };

  const hasValue = text.trim().length > 0;

  const changeMonth = (direction: number) => {
    const nextDate = new Date(year, month + direction, 1);
    setYear(nextDate.getFullYear());
    setMonth(nextDate.getMonth());
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const dayCells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDayIndex + 1;
    return new Date(year, month, dayNumber);
  });

  return (
    <div className="mb-3" ref={wrapperRef} style={{ position: "relative" }}>
      <span
        className="p-float-label"
        style={{ display: "block", position: "relative" }}
      >
        <input
          id={label}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={16}
          required={required}
          value={text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const nextValue = formatManualDateTime(e.target.value);
            setText(nextValue);
            if (!nextValue) {
              onChange("");
            } else if (isCompleteManualDateTime(nextValue)) {
              const parsed = parseDisplayDateTime(nextValue);
              if (parsed) onChange(formatDateFromDate(parsed));
            }
          }}
          placeholder=" "
          className={classNames(
            "w-full",
            "p-inputtext",
            "p-inputtext-sm",
            "input-form-sm",
            open ? "pr-10" : "",
          )}
        />
        <label
          htmlFor={label}
          className={classNames("label-sm", {
            "label-floating": hasValue || open || isFocused,
          })}
          style={{
            left: 10,
            top: hasValue || open || isFocused ? "-0.05rem" : "70%",
            transform: hasValue || open || isFocused ? "translateY(0)" : "translateY(-50%)",
            fontSize: hasValue || open || isFocused ? 12 : 14,
            background: "#fff",
            padding: "0 4px",
            color: "#6b7280",
          }}
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 16,
          }}
          aria-label="Open date picker"
        >
          📅
        </button>
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 1000,
            width: 300,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            padding: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              style={{
                border: "1px solid #ddd",
                borderRadius: 4,
                background: "#fff",
              }}
            >
              ‹
            </button>
            <strong>
              {new Date(year, month).toLocaleString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </strong>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              style={{
                border: "1px solid #ddd",
                borderRadius: 4,
                background: "#fff",
              }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              marginBottom: 8,
            }}
          >
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "#666",
                  fontWeight: 600,
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
            }}
          >
            {dayCells.map((date, index) => {
              const sameMonth = date.getMonth() === month;
              const isSelected =
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

              return (
                <button
                  key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`}
                  type="button"
                  onClick={() => {
                    const nextDate = new Date(selectedDate);
                    nextDate.setFullYear(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                    );
                    setSelectedDate(nextDate);
                    setMonth(nextDate.getMonth());
                    setYear(nextDate.getFullYear());
                  }}
                  style={{
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 0",
                    background: isSelected
                      ? "#3b82f6"
                      : sameMonth
                        ? "#f9fafb"
                        : "#fff",
                    color: isSelected
                      ? "#fff"
                      : sameMonth
                        ? "#111827"
                        : "#9ca3af",
                    cursor: "pointer",
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontSize: 12 }}>Giờ:</label>
              <select
                value={selectedDate.getHours()}
                onChange={(e) => {
                  const next = new Date(selectedDate);
                  next.setHours(Number(e.target.value));
                  setSelectedDate(next);
                }}
                style={{
                  width: 62,
                  borderRadius: 4,
                  border: "1px solid #d1d5db",
                  padding: 4,
                }}
              >
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={hour}>
                    {String(hour).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontSize: 12 }}>Phút:</label>
              <select
                value={selectedDate.getMinutes()}
                onChange={(e) => {
                  const next = new Date(selectedDate);
                  next.setMinutes(Number(e.target.value));
                  setSelectedDate(next);
                }}
                style={{
                  width: 62,
                  borderRadius: 4,
                  border: "1px solid #d1d5db",
                  padding: 4,
                }}
              >
                {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                  <option key={minute} value={minute}>
                    {String(minute).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                border: "1px solid #ddd",
                borderRadius: 4,
                padding: "6px 10px",
                background: "#fff",
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                applySelectedDate(selectedDate);
                setOpen(false);
              }}
              style={{
                border: "none",
                borderRadius: 4,
                padding: "6px 10px",
                background: "#2563eb",
                color: "#fff",
              }}
            >
              Chọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeField;
