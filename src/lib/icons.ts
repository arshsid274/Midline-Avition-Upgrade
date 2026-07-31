import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ConciergeBell,
  Globe,
  Globe2,
  LineChart,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sofa,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

import { type IconName } from './icon-names'

/**
 * Slug to component, for the icons an editor can pick on a feature card.
 *
 * A CMS can store the string 'shield-check'; it cannot store a React
 * component. This is the one place that bridges the two.
 *
 * Typed as Record<IconName, LucideIcon> on purpose: adding a name to
 * icon-names.ts without adding it here fails the build, rather than shipping a
 * card with an invisible icon that nobody notices until a client points at it.
 */
export const ICONS: Record<IconName, LucideIcon> = {
  'calendar-clock': CalendarClock,
  sofa: Sofa,
  'shield-check': ShieldCheck,
  'concierge-bell': ConciergeBell,
  globe: Globe,
  'globe-2': Globe2,
  'line-chart': LineChart,
  shield: Shield,
  wallet: Wallet,
  wrench: Wrench,
  'check-circle': CheckCircle2,
  sliders: SlidersHorizontal,
  'arrow-up-right': ArrowUpRight,
}

/**
 * The component for a stored icon name, or a sensible stand-in.
 *
 * The fallback matters because drafts skip required-field validation, so a
 * half-finished card can reach a component with no icon set at all. Rendering
 * a tick beats throwing inside a map().
 */
export const iconFor = (name: string | null | undefined): LucideIcon =>
  (name && ICONS[name as IconName]) || CheckCircle2
