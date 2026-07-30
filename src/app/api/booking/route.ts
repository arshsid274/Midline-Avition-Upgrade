import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type BookingPayload = {
  tripType?: unknown;
  departureCity?: unknown;
  arrivalCity?: unknown;
  departureAirport?: unknown;
  arrivalAirport?: unknown;
  departureDate?: unknown;
  departureTime?: unknown;
  returnDate?: unknown;
  returnTime?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  emailAddress?: unknown;
  phoneNumber?: unknown;
  selectedAircraft?: unknown;
  passengers?: unknown;
};

const RECIPIENT_EMAIL = "arshsid274@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d\s.-]{7,20}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

const cleanString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// Structured selection sent by the booking form's airport suggest — either a
// concrete airport ({code, icao, iata, ...}) or a metro-area "Any airport"
// pick ({flexible: true, metro, main_ap}). Rendered into one detail string
// for the operations email; absent/malformed payloads degrade to "".
const describeAirportSelection = (value: unknown) => {
  if (!value || typeof value !== "object") return "";
  const selection = value as Record<string, unknown>;

  if (selection.flexible === true) {
    const metro = cleanString(selection.metro);
    const mainAp = cleanString(selection.main_ap);
    if (!metro) return "";
    return `Any airport in ${metro}${mainAp ? ` (suggested: ${mainAp})` : ""}`;
  }

  const name = cleanString(selection.name);
  const code = cleanString(selection.code);
  const icao = cleanString(selection.icao);
  const iata = cleanString(selection.iata);
  if (!name && !code) return "";

  const codes = [...new Set([iata, icao, code].filter(Boolean))].join("/");
  const lat = typeof selection.lat === "number" ? selection.lat.toFixed(4) : "";
  const lon = typeof selection.lon === "number" ? selection.lon.toFixed(4) : "";
  const coordinates = lat && lon ? ` [${lat}, ${lon}]` : "";
  return `${name}${codes ? ` (${codes})` : ""}${coordinates}`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildRow = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 12px;font-weight:600;color:#161616;border-bottom:1px solid #e0e0e0;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;color:#525252;border-bottom:1px solid #e0e0e0;">${escapeHtml(value || "Not provided")}</td>
  </tr>
`;

export async function POST(request: Request) {
  let payload: BookingPayload;

  try {
    payload = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ message: "Invalid booking request." }, { status: 400 });
  }

  const tripType = cleanString(payload.tripType);
  const departureCity = cleanString(payload.departureCity);
  const arrivalCity = cleanString(payload.arrivalCity);
  const departureDate = cleanString(payload.departureDate);
  const departureTime = cleanString(payload.departureTime);
  const returnDate = cleanString(payload.returnDate);
  const returnTime = cleanString(payload.returnTime);
  const firstName = cleanString(payload.firstName);
  const lastName = cleanString(payload.lastName);
  const emailAddress = cleanString(payload.emailAddress);
  const phoneNumber = cleanString(payload.phoneNumber);
  const selectedAircraft = cleanString(payload.selectedAircraft);
  const passengers = cleanString(payload.passengers);
  const isRoundTrip = tripType === "round-trip";

  const passengerCount = Number(passengers);
  const errors = [
    tripType !== "one-way" && tripType !== "round-trip" ? "Select a valid trip type." : "",
    !departureCity ? "Departure city is required." : "",
    !arrivalCity ? "Arrival city is required." : "",
    !DATE_PATTERN.test(departureDate) ? "Departure date is required." : "",
    !TIME_PATTERN.test(departureTime) ? "Departure time is required." : "",
    isRoundTrip && !DATE_PATTERN.test(returnDate) ? "Return date is required." : "",
    isRoundTrip && !TIME_PATTERN.test(returnTime) ? "Return time is required." : "",
    isRoundTrip && returnDate < departureDate ? "Return date must be after the departure date." : "",
    !firstName ? "First name is required." : "",
    !lastName ? "Last name is required." : "",
    !EMAIL_PATTERN.test(emailAddress) ? "A valid email address is required." : "",
    !PHONE_PATTERN.test(phoneNumber) ? "A valid phone number is required." : "",
    !selectedAircraft ? "Aircraft selection is required." : "",
    !Number.isInteger(passengerCount) || passengerCount < 1 || passengerCount > 13
      ? "Passenger count must be between 1 and 13."
      : "",
  ].filter(Boolean);

  if (errors.length > 0) {
    return NextResponse.json({ message: errors[0] }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return NextResponse.json({ message: "Email service is not configured yet." }, { status: 500 });
  }

  const departureAirportDetails = describeAirportSelection(payload.departureAirport);
  const arrivalAirportDetails = describeAirportSelection(payload.arrivalAirport);

  const rows = [
    ["Trip Type", tripType === "round-trip" ? "Round Trip" : "One Way"],
    ["Departure", departureCity],
    ["Departure Airport", departureAirportDetails],
    ["Arrival", arrivalCity],
    ["Arrival Airport", arrivalAirportDetails],
    ["Departure Date", departureDate],
    ["Departure Time", departureTime],
    ["Return Date", isRoundTrip ? returnDate : "Not applicable"],
    ["Return Time", isRoundTrip ? returnTime : "Not applicable"],
    ["First Name", firstName],
    ["Last Name", lastName],
    ["Email", emailAddress],
    ["Phone", phoneNumber],
    ["Aircraft", selectedAircraft],
    ["Passengers", passengers],
  ];

  const textBody = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlBody = `
    <div style="font-family:'IBM Plex Sans',Arial,sans-serif;line-height:1.5;color:#161616;">
      <h2 style="margin:0 0 16px;font-weight:400;color:#161616;border-bottom:2px solid #0f62fe;padding-bottom:8px;">New Midline Aviation Booking Request</h2>
      <table style="border-collapse:collapse;width:100%;max-width:680px;border:1px solid #e0e0e0;border-radius:0;">
        <tbody>${rows.map(([label, value]) => buildRow(label, value)).join("")}</tbody>
      </table>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: RECIPIENT_EMAIL,
      replyTo: emailAddress,
      subject: `New booking request from ${firstName} ${lastName}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ message: "Booking request sent." });
  } catch (error) {
    console.error("Booking email failed:", error);
    return NextResponse.json({ message: "Unable to send booking request right now." }, { status: 500 });
  }
}
