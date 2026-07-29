import React from 'react'

/**
 * Static explanatory notes rendered inside a tab as `ui` fields.
 *
 * These exist so a section that has no editable content, or whose content
 * lives in a collection, still appears in the page's tab list. Otherwise an
 * editor looking at that band on the live site finds no tab for it and assumes
 * the CMS is broken.
 */
const noteStyle: React.CSSProperties = {
  margin: '1rem 0 0',
  padding: '.75rem 1rem',
  borderLeft: '3px solid var(--theme-elevation-200, #ccc)',
  background: 'var(--theme-elevation-50, #f4f4f4)',
  fontSize: '.85rem',
  lineHeight: 1.5,
}

export const BookingFormNote = () => (
  <p style={noteStyle}>
    Directly below the hero sits the <strong>Book Your Flight</strong> form. It has no editable
    wording here — its airport list is generated from the airport database.
  </p>
)

export const AccreditationsNote = () => (
  <p style={noteStyle}>
    The logos in this strip are managed in{' '}
    <a href="/admin/collections/accreditations">Content Library → Accreditations</a>. Tick{' '}
    <strong>enabled</strong> on one to show it here and on the Safety page.
  </p>
)

export const ContactFormNote = () => (
  <p style={noteStyle}>
    The <strong>enquiry form</strong> beside these details has fixed wording — its fields and
    dropdowns are part of the booking system, not editable copy.
  </p>
)

export const MembershipsNote = () => (
  <p style={noteStyle}>
    The logos shown here come from{' '}
    <a href="/admin/collections/accreditations">Content Library → Accreditations</a> — only those
    marked <strong>Membership</strong> and <strong>enabled</strong> appear on this page.
  </p>
)

export const AircraftNote = () => (
  <p style={noteStyle}>
    The aircraft, their photographs and their performance figures are edited in{' '}
    <a href="/admin/collections/aircraft">Content Library → Aircraft</a>. Changes there appear
    here, on the home page and on each aircraft&apos;s own page.
  </p>
)

export const LegalNote = () => (
  <p style={noteStyle}>
    The wording of this document is maintained in the codebase, where each revision carries an
    author and a reviewable history — which is what legal sign-off needs. Ask a developer to
    change the text, then update the date above.
  </p>
)
