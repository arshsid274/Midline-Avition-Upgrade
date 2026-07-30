"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import { useAirportSuggest } from "@/hooks/useAirportSuggest";
import {
  formatSelectionValue,
  type AirportSelection,
  type SuggestionItem,
} from "@/lib/airports";

const AIRCRAFT_OPTIONS = [
  { code: "T7-MID", manufacturer: "Gulfstream", category: "Heavy", maxPax: 13 },
  { code: "T7-MIDA", manufacturer: "Gulfstream", category: "Mid Size", maxPax: 8 },
  { code: "T7-MIDB", manufacturer: "Embraer", category: "Heavy", maxPax: 13 },
];

type TripType = "one-way" | "round-trip";
type AirportField = "departure" | "arrival";
type SubmitStatus = "idle" | "submitting" | "success" | "error";

// What the booking email needs to identify the chosen airport (or metro-area
// "Any airport" pick, where ops chooses the exact field later).
const selectionPayload = (selection: AirportSelection | null) => {
  if (!selection) return null;
  if (selection.kind === "metro") {
    return {
      flexible: true,
      metro: selection.ma.name,
      country: selection.ma.country,
      main_ap: selection.ma.main_ap,
    };
  }
  const { code, icao, iata, name, city, country, lat, lon } = selection.ap;
  return { flexible: false, code, icao, iata, name, city, country, lat, lon };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d\s.-]{7,20}$/;

type HeroBookingFormProps = {
  revealFromBelow?: boolean;
};

const MONTH_LABELS = [
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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const padDatePart = (value: number) => value.toString().padStart(2, "0");

const toIsoDate = (value: Date) =>
  `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`;

const parseIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;

  const parsedDate = new Date(year, month - 1, day);
  const isValidDate =
    parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day;

  return isValidDate ? parsedDate : null;
};

const formatTimeLabel = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) return "";

  const [hoursText, minutesText] = value.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return "";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${minutesText} ${suffix}`;
};

const parseManualTimeValue = (value: string) => {
  const normalizedValue = value.trim().toUpperCase();
  if (!normalizedValue) return null;

  const twentyFourHourMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);

    if (Number.isInteger(hours) && Number.isInteger(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${padDatePart(hours)}:${padDatePart(minutes)}`;
    }

    return null;
  }

  const twelveHourMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/);
  if (!twelveHourMatch) return null;

  const hours12 = Number(twelveHourMatch[1]);
  const minutes = Number(twelveHourMatch[2]);
  const period = twelveHourMatch[3];

  if (!Number.isInteger(hours12) || !Number.isInteger(minutes) || hours12 < 1 || hours12 > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  const hours24 = period === "PM" ? (hours12 % 12) + 12 : hours12 % 12;
  return `${padDatePart(hours24)}:${padDatePart(minutes)}`;
};

const TIME_OPTIONS = Array.from({ length: 96 }, (_, index) => {
  const hours = Math.floor(index / 4);
  const minutes = (index % 4) * 15;
  const value = `${padDatePart(hours)}:${padDatePart(minutes)}`;

  return {
    value,
    label: formatTimeLabel(value),
  };
});

type CalendarDay = {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
};

const buildCalendarDays = (monthStart: Date): CalendarDay[] => {
  const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());

  const today = new Date();

  return Array.from({ length: 42 }, (_, index) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + index);

    const iso = toIsoDate(dayDate);
    const isToday =
      dayDate.getFullYear() === today.getFullYear() &&
      dayDate.getMonth() === today.getMonth() &&
      dayDate.getDate() === today.getDate();

    return {
      iso,
      day: dayDate.getDate(),
      inCurrentMonth: dayDate.getMonth() === monthStart.getMonth(),
      isToday,
    };
  });
};

type DatePickerFieldProps = {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  minDateValue?: string;
};

function DatePickerField({ value, onChange, placeholder, minDateValue }: DatePickerFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [manualDateError, setManualDateError] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => {
    const selected = parseIsoDate(value.trim());
    const baseDate = selected ?? new Date();
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  });
  const minDateCandidate = (minDateValue ?? "").trim();
  const minimumIsoDate = parseIsoDate(minDateCandidate) ? minDateCandidate : null;
  const calendarDays = useMemo(() => buildCalendarDays(monthCursor), [monthCursor]);

  const applyManualDateValue = (rawValue: string) => {
    const normalizedValue = rawValue.trim();

    if (!normalizedValue) {
      onChange("");
      setManualDateError("");
      return true;
    }

    const parsedDate = parseIsoDate(normalizedValue);
    if (!parsedDate) {
      setManualDateError("Use YYYY-MM-DD format.");
      return false;
    }

    if (minimumIsoDate && normalizedValue < minimumIsoDate) {
      setManualDateError(`Date must be on or after ${minimumIsoDate}.`);
      return false;
    }

    onChange(normalizedValue);
    setMonthCursor(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    setManualDateError("");
    return true;
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeIfOutside = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target;
      if (!(targetNode instanceof Node)) return;
      if (!containerRef.current?.contains(targetNode)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", closeIfOutside);
    window.addEventListener("touchstart", closeIfOutside);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("mousedown", closeIfOutside);
      window.removeEventListener("touchstart", closeIfOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex h-11 w-full border-b border-ink-subtle bg-surface-1 text-sm transition-colors focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ibm-blue">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          placeholder="YYYY-MM-DD"
          aria-label={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
            if (manualDateError) setManualDateError("");
          }}
          onBlur={() => {
            applyManualDateValue(value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              applyManualDateValue(value);
            }
          }}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
        />
        <button
          type="button"
          onClick={() =>
            setIsOpen((current) => {
              const nextState = !current;

              if (nextState) {
                const selected = parseIsoDate(value.trim());
                const baseDate = selected ?? new Date();
                setMonthCursor(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
              }

              return nextState;
            })
          }
          className="h-full shrink-0 border-l border-hairline px-3 text-xs font-semibold text-ibm-blue transition-colors hover:bg-surface-2"
        >
          Pick
        </button>
      </div>

      {manualDateError && <p className="mt-1 px-1 text-[11px] text-error">{manualDateError}</p>}

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 border border-hairline bg-white p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              className="border border-hairline px-2 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface-1"
            >
              Prev
            </button>
            <p className="text-sm font-semibold text-ink">
              {MONTH_LABELS[monthCursor.getMonth()]} {monthCursor.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() =>
                setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
              className="border border-hairline px-2 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface-1"
            >
              Next
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="text-center text-[10px] font-medium text-ink-subtle"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isDisabled = minimumIsoDate ? day.iso < minimumIsoDate : false;
              const isSelected = day.iso === value;

              const dayClassName = [
                "h-8 text-xs font-medium transition-colors",
                day.inCurrentMonth ? "text-ink" : "text-ink-subtle",
                day.isToday ? "border border-ink-subtle" : "",
                isSelected ? "border-none bg-ibm-blue text-white" : "",
                !isSelected && !isDisabled ? "hover:bg-surface-1" : "",
                isDisabled ? "cursor-not-allowed text-surface-2" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={day.iso}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(day.iso);
                    setManualDateError("");
                    setIsOpen(false);
                  }}
                  className={dayClassName}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

type TimePickerFieldProps = {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
};

function TimePickerField({ value, onChange, placeholder }: TimePickerFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [manualTimeError, setManualTimeError] = useState("");
  const normalizedTimeValue = parseManualTimeValue(value);

  const applyManualTimeValue = (rawValue: string) => {
    const normalizedInput = rawValue.trim();

    if (!normalizedInput) {
      onChange("");
      setManualTimeError("");
      return true;
    }

    const parsedTime = parseManualTimeValue(normalizedInput);
    if (!parsedTime) {
      setManualTimeError("Use HH:MM or h:mm AM/PM.");
      return false;
    }

    onChange(parsedTime);
    setManualTimeError("");
    return true;
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeIfOutside = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target;
      if (!(targetNode instanceof Node)) return;
      if (!containerRef.current?.contains(targetNode)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", closeIfOutside);
    window.addEventListener("touchstart", closeIfOutside);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("mousedown", closeIfOutside);
      window.removeEventListener("touchstart", closeIfOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex h-11 w-full border-b border-ink-subtle bg-surface-1 text-sm transition-colors focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ibm-blue">
        <input
          type="text"
          inputMode="text"
          value={value}
          placeholder="HH:MM or 2:30 PM"
          aria-label={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
            if (manualTimeError) setManualTimeError("");
          }}
          onBlur={() => {
            applyManualTimeValue(value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              applyManualTimeValue(value);
            }
          }}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="h-full shrink-0 border-l border-hairline px-3 text-xs font-semibold text-ibm-blue transition-colors hover:bg-surface-2"
        >
          Pick
        </button>
      </div>

      {manualTimeError && <p className="mt-1 px-1 text-[11px] text-error">{manualTimeError}</p>}

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 border border-hairline bg-white p-2">
          <div className="mb-2 px-1 text-[11px] font-medium text-ink-muted">
            Select Time
          </div>
          <p className="mb-2 px-1 text-[11px] text-ink-subtle">Or type manually: HH:MM or h:mm AM/PM</p>
          <div className="max-h-56 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-1">
              {TIME_OPTIONS.map((option) => {
                const isSelected = option.value === normalizedTimeValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setManualTimeError("");
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                      isSelected ? "bg-ibm-blue text-white" : "text-ink hover:bg-surface-1"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeroBookingForm({ revealFromBelow = false }: HeroBookingFormProps) {
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureSelection, setDepartureSelection] = useState<AirportSelection | null>(null);
  const [arrivalSelection, setArrivalSelection] = useState<AirportSelection | null>(null);
  const [activeAirportField, setActiveAirportField] = useState<AirportField | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [paxCount, setPaxCount] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [toastMounted, setToastMounted] = useState(false);

  // One suggest session per field — mirrors VistaJet's widget, where each
  // input keeps its own debounced query against the suggest endpoint.
  const departureSuggest = useAirportSuggest();
  const arrivalSuggest = useAirportSuggest();

  // Portal target only exists client-side.
  useEffect(() => {
    setToastMounted(true);
    return () => setToastMounted(false);
  }, []);

  // Auto-dismiss the toast — success sooner, errors get a little longer.
  useEffect(() => {
    if (!submitMessage || submitStatus === "submitting") return;
    const timer = window.setTimeout(
      () => setSubmitMessage(""),
      submitStatus === "success" ? 6000 : 9000
    );
    return () => window.clearTimeout(timer);
  }, [submitMessage, submitStatus]);

  const isRoundTrip = tripType === "round-trip";
  const selectedAircraftDetails = AIRCRAFT_OPTIONS.find((aircraft) => aircraft.code === selectedAircraft);
  const selectedAircraftMaxPax = selectedAircraftDetails?.maxPax ?? 13;
  const paxHasValue = paxCount.trim().length > 0;
  const paxNumber = paxHasValue ? Number(paxCount) : Number.NaN;
  const paxHasInvalidFormat = paxHasValue && (!Number.isFinite(paxNumber) || !Number.isInteger(paxNumber));
  const paxOverGlobalLimit = Number.isFinite(paxNumber) && paxNumber > 13;
  const paxOverSelectedLimit = Number.isFinite(paxNumber) && paxNumber > selectedAircraftMaxPax;
  const paxUnderMinimum = Number.isFinite(paxNumber) && paxNumber < 1;
  const paxErrorMessage = paxOverGlobalLimit
    ? "Our aircraft is not able to book more than 13 people in a single go."
    : paxOverSelectedLimit
      ? `Selected jet ${selectedAircraftDetails?.code} allows up to ${selectedAircraftMaxPax} people only.`
      : paxHasInvalidFormat || paxUnderMinimum
        ? "Please enter a whole number of people starting from 1."
      : "";
  const paxIsInvalid = paxHasInvalidFormat || paxUnderMinimum || paxOverGlobalLimit || paxOverSelectedLimit;

  const suggestFor = (field: AirportField) =>
    field === "departure" ? departureSuggest : arrivalSuggest;
  const cityFor = (field: AirportField) => (field === "departure" ? departureCity : arrivalCity);

  const handleAirportInputChange = (field: AirportField, value: string) => {
    if (field === "departure") {
      setDepartureCity(value);
      setDepartureSelection(null);
    } else {
      setArrivalCity(value);
      setArrivalSelection(null);
    }
    setActiveSuggestionIndex(-1);
    suggestFor(field).search(value);
  };

  const handleAirportFocus = (field: AirportField) => {
    setActiveAirportField(field);
    setActiveSuggestionIndex(-1);
    const current = cityFor(field).trim();
    if (current.length < 2) {
      suggestFor(field).loadPopular();
    } else {
      suggestFor(field).search(current);
    }
  };

  const handleSuggestionSelect = (field: AirportField, item: SuggestionItem) => {
    // Picking a metro header ("Any airport") records the metro without
    // committing to a specific field — mirroring VistaJet's top row; ops
    // resolves it to the metro's main_ap (or better) later.
    const selection: AirportSelection =
      item.type === "airport" || item.type === "airport-nested"
        ? { kind: "airport", ap: item.ap }
        : { kind: "metro", ma: item.ma };
    const nextValue = formatSelectionValue(selection);

    if (field === "departure") {
      setDepartureCity(nextValue);
      setDepartureSelection(selection);
    } else {
      setArrivalCity(nextValue);
      setArrivalSelection(selection);
    }

    setActiveAirportField(null);
    setActiveSuggestionIndex(-1);
  };

  const handleAirportKeyDown = (field: AirportField, event: KeyboardEvent<HTMLInputElement>) => {
    const { items } = suggestFor(field);
    const isOpen = activeAirportField === field && items.length > 0;

    if (event.key === "Escape") {
      setActiveAirportField(null);
      setActiveSuggestionIndex(-1);
      return;
    }
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((current) => (current + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((current) => (current <= 0 ? items.length - 1 : current - 1));
    } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      handleSuggestionSelect(field, items[activeSuggestionIndex]);
    }
  };

  const closeSuggestionsAfterBlur = (field: AirportField) => {
    window.setTimeout(() => {
      setActiveAirportField((currentField) => (currentField === field ? null : currentField));
    }, 100);
  };

  // Row template mirrors XO's grouped listbox: metro header rows ("Any
  // airport"), the metro's members as indented nested rows, then flat
  // non-metro matches — all pre-ordered by groupAirports().
  const renderSuggestionList = (field: AirportField) => {
    const { items, loading, isEmpty } = suggestFor(field);
    if (!loading && !isEmpty && items.length === 0) return null;

    return (
      <ul
        id={`${field}-airport-listbox`}
        role="listbox"
        aria-label={`${field === "departure" ? "Departure" : "Arrival"} airport suggestions`}
        className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto border border-hairline bg-white"
      >
        {loading && items.length === 0 && (
          <li className="px-3 py-2 text-xs text-ink-muted">Searching airports…</li>
        )}
        {isEmpty && !loading && (
          <li className="px-3 py-2 text-xs text-ink-muted">No airports found.</li>
        )}
        {items.map((item, index) => {
          const isMetro = item.type === "metropolitan-area" || item.type === "metropolitan-area-with-airports";
          const isActive = index === activeSuggestionIndex;
          const key = isMetro
            ? `metro-${item.ma.metropolitan_area_id}`
            : `${item.ap.code}-${item.ap.name}`;

          return (
            <li key={key} role="option" aria-selected={isActive} id={`${field}-airport-option-${index}`}>
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSuggestionSelect(field, item);
                }}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
                className={`w-full px-3 py-2 text-left normal-case hover:bg-surface-1 ${
                  isActive ? "bg-surface-1" : ""
                } ${item.type === "airport-nested" ? "border-l-2 border-hairline pl-6" : ""}`}
              >
                {isMetro ? (
                  <>
                    <span className="block truncate text-sm font-semibold text-ink">
                      {item.ma.name}, {item.ma.country}
                    </span>
                    <span className="block truncate text-xs font-medium text-ibm-blue">Any airport</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      <span className="block truncate text-sm font-medium text-ink">
                        {item.ap.name}
                      </span>
                      {item.ap.isPrivate && (
                        <span className="shrink-0 border border-ibm-blue px-1.5 py-0.5 text-[10px] font-medium text-ibm-blue">
                          Private
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {item.ap.code}, {item.ap.city}
                      {item.type === "airport-nested" ? "" : `, ${item.ap.country}`}
                    </span>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderAirportInput = (field: AirportField, placeholder: string) => {
    const isOpen = activeAirportField === field;

    return (
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={cityFor(field)}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${field}-airport-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && activeSuggestionIndex >= 0
              ? `${field}-airport-option-${activeSuggestionIndex}`
              : undefined
          }
          onChange={(event) => handleAirportInputChange(field, event.target.value)}
          onFocus={() => handleAirportFocus(field)}
          onBlur={() => closeSuggestionsAfterBlur(field)}
          onKeyDown={(event) => handleAirportKeyDown(field, event)}
          className="h-11 w-full border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue"
          autoComplete="off"
          required
        />
        {isOpen && renderSuggestionList(field)}
      </div>
    );
  };

  const departureDateIsValid = parseIsoDate(departureDate.trim()) !== null;
  const departureTimeIsValid = parseManualTimeValue(departureTime.trim()) !== null;
  const returnDateIsValid = parseIsoDate(returnDate.trim()) !== null;
  const returnTimeIsValid = parseManualTimeValue(returnTime.trim()) !== null;
  const returnDateIsAfterDeparture = returnDate.trim() >= departureDate.trim();
  const emailIsValid = EMAIL_PATTERN.test(emailAddress.trim());
  const phoneIsValid = PHONE_PATTERN.test(phoneNumber.trim());

  // Airports must be picked from the suggestion list — free-typed text no
  // longer qualifies (it used to lose the airport identity anyway).
  const primaryDetailsComplete =
    departureSelection !== null &&
    arrivalSelection !== null &&
    departureDateIsValid &&
    departureTimeIsValid &&
    (!isRoundTrip || (returnDateIsValid && returnTimeIsValid && returnDateIsAfterDeparture));

  const contactDetailsComplete =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    emailIsValid &&
    phoneIsValid &&
    selectedAircraft.trim().length > 0 &&
    paxHasValue &&
    !paxIsInvalid;

  const canSubmit = primaryDetailsComplete && contactDetailsComplete && submitStatus !== "submitting";

  const changeTripType = (nextType: TripType) => {
    setTripType(nextType);
    if (nextType === "one-way") {
      setReturnDate("");
      setReturnTime("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");

    if (!canSubmit) {
      setSubmitStatus("error");
      setSubmitMessage(
        departureSelection === null || arrivalSelection === null
          ? "Please pick your departure and arrival airports from the suggestion list."
          : "Please complete every required field with a valid email and phone number."
      );
      return;
    }

    setSubmitStatus("submitting");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripType,
          departureCity: departureCity.trim(),
          arrivalCity: arrivalCity.trim(),
          departureAirport: selectionPayload(departureSelection),
          arrivalAirport: selectionPayload(arrivalSelection),
          departureDate: departureDate.trim(),
          departureTime: departureTime.trim(),
          returnDate: isRoundTrip ? returnDate.trim() : "",
          returnTime: isRoundTrip ? returnTime.trim() : "",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emailAddress: emailAddress.trim(),
          phoneNumber: phoneNumber.trim(),
          selectedAircraft,
          passengers: paxCount.trim(),
        }),
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to send your request right now.");
      }

      setSubmitStatus("success");
      setSubmitMessage("Your flight request has been sent. Our team will contact you shortly.");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Unable to send your request right now.");
    }
  };

  return (
    <section
      id="book-your-flight"
      aria-label="Flight booking form"
      className="relative z-40 -mt-16 scroll-mt-28 px-4 sm:px-6 md:px-10"
    >
      <form
        className={`mx-auto w-full max-w-6xl border border-hairline bg-white p-4 text-ink transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5 md:p-6 ${
          revealFromBelow ? "translate-y-0 opacity-100 delay-[180ms]" : "translate-y-16 opacity-0"
        }`}
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">Book Your Flight</p>
          <div className="relative inline-grid grid-cols-2 border border-hairline bg-surface-1 p-1">
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 w-[calc(50%-4px)] bg-ink transition-transform duration-300 ${
                isRoundTrip ? "translate-x-[calc(100%+4px)]" : "translate-x-1"
              }`}
            />
            <button
              type="button"
              onClick={() => changeTripType("one-way")}
              className={`relative z-[1] px-4 py-1.5 text-xs font-semibold transition-colors ${
                !isRoundTrip ? "text-white" : "text-ink-muted"
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => changeTripType("round-trip")}
              className={`relative z-[1] px-4 py-1.5 text-xs font-semibold transition-colors ${
                isRoundTrip ? "text-white" : "text-ink-muted"
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {renderAirportInput("departure", "Departure City, Country or Airport Code")}
          {renderAirportInput("arrival", "Arrival City, Country or Airport Code")}
          <DatePickerField value={departureDate} onChange={setDepartureDate} placeholder="Departure Date" />
          <TimePickerField value={departureTime} onChange={setDepartureTime} placeholder="Departure Time" />
        </div>

        {isRoundTrip && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DatePickerField
              value={returnDate}
              onChange={setReturnDate}
              placeholder="Return Date"
              minDateValue={departureDate}
            />
            <TimePickerField value={returnTime} onChange={setReturnTime} placeholder="Return Time" />
          </div>
        )}

        <div
          className={`overflow-hidden transition-all duration-500 ${
            primaryDetailsComplete
              ? "mt-4 max-h-[560px] border-t border-hairline pt-4 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="h-11 border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue"
              required={primaryDetailsComplete}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="h-11 border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue"
              required={primaryDetailsComplete}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              className="h-11 border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue"
              required={primaryDetailsComplete}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              pattern="[+()0-9\s.-]{7,20}"
              className="h-11 border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue"
              required={primaryDetailsComplete}
            />
            <select
              aria-label="Select aircraft type"
              value={selectedAircraft}
              onChange={(event) => {
                setSelectedAircraft(event.target.value);
                setPaxCount("");
              }}
              className="h-11 border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue"
              required={primaryDetailsComplete}
            >
              <option value="" className="text-ink">
                Select Jet
              </option>
              {AIRCRAFT_OPTIONS.map((aircraft) => (
                <option key={aircraft.code} value={aircraft.code} className="text-ink">
                  {`${aircraft.code} - ${aircraft.manufacturer} - ${aircraft.category} - Max ${aircraft.maxPax}`}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="No. of People"
              value={paxCount}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue.length === 0) {
                  setPaxCount("");
                  return;
                }
                if (!/^\d+$/.test(nextValue)) return;
                setPaxCount(nextValue);
              }}
              className="h-11 border-b border-ink-subtle bg-surface-1 px-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-2 focus:-outline-offset-2 focus:outline-ibm-blue disabled:cursor-not-allowed disabled:opacity-55"
              min={1}
              max={selectedAircraftMaxPax}
              step={1}
              disabled={!selectedAircraft}
              required={primaryDetailsComplete}
            />
          </div>
          {primaryDetailsComplete && (emailAddress.trim().length > 0 || phoneNumber.trim().length > 0) && (!emailIsValid || !phoneIsValid) && (
            <p className="mt-2 text-xs font-semibold text-error">
              Enter a valid email address and phone number before sending the request.
            </p>
          )}
          {paxErrorMessage && (
            <p className="mt-2 text-xs font-semibold text-error">
              {paxErrorMessage}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-11 items-center justify-center bg-ibm-blue px-5 text-sm font-normal text-white transition-colors hover:bg-ibm-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ibm-blue disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitStatus === "submitting" ? "Sending..." : "Request Flight"}
            </button>
          </div>
        </div>
      </form>

      {/* Right-side toast — portaled to <body> because the form's reveal
          transform would otherwise trap position:fixed inside it. */}
      {toastMounted &&
        submitMessage &&
        submitStatus !== "submitting" &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="fixed right-4 top-24 z-[90] w-[calc(100vw-2rem)] max-w-sm motion-safe:animate-[toastIn_0.35s_cubic-bezier(0.22,1,0.36,1)_both] md:top-28"
          >
            <div
              className={`flex items-start gap-3 border border-hairline border-l-2 bg-white p-4 text-ink ${
                submitStatus === "success" ? "border-l-success" : "border-l-error"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  submitStatus === "success" ? "bg-surface-1 text-success" : "bg-surface-1 text-error"
                }`}
              >
                {submitStatus === "success" ? <CheckCircle2 className="h-4.5 w-4.5" /> : <AlertTriangle className="h-4.5 w-4.5" />}
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-semibold leading-snug">
                  {submitStatus === "success" ? "Request received" : "Something went wrong"}
                </p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-muted">{submitMessage}</p>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setSubmitMessage("")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-ink-subtle transition-colors hover:bg-surface-1 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
