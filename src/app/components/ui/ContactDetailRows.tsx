import { Clock3, Mail, MapPin, Phone } from "lucide-react";

import type { ContactDetail } from "@/lib/contact-content";

/**
 * The address / email / phone / hours boxes on the contact page.
 *
 * The icon is chosen from the row's `kind` rather than stored in the CMS —
 * an editor should pick "Phone" from a list, not paste an icon name.
 */
const ICONS = {
  address: MapPin,
  email: Mail,
  phone: Phone,
  hours: Clock3,
} as const;

export default function ContactDetailRows({ rows }: { rows: ContactDetail[] }) {
  return (
    <div data-reveal-item className="mt-8 space-y-4">
      {rows.map((row, index) => {
        const Icon = ICONS[row.kind] ?? MapPin;
        const alignment = row.kind === "address" ? "items-start" : "items-center";
        const iconClass =
          row.kind === "address"
            ? "mt-0.5 h-4 w-4 shrink-0 text-white"
            : "h-4 w-4 shrink-0 text-white";

        return (
          <div
            key={`${row.kind}-${index}`}
            className={`flex ${alignment} gap-3 border border-inverse-surface-1 bg-inverse-canvas px-4 py-3`}
          >
            <Icon className={iconClass} />
            {row.href ? (
              <a
                className="text-sm text-inverse-ink-muted transition-colors hover:text-white"
                href={row.href}
              >
                {row.value}
              </a>
            ) : (
              <p className="text-sm text-inverse-ink-muted">{row.value}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
