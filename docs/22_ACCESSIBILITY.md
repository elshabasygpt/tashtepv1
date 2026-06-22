# Accessibility Guide

> Tashtep Enterprise Accessibility Standards
>
> Version: 1.0
>
> Single Source of Truth

---

# Philosophy

Accessibility is a product requirement.

It is not an optional enhancement.

Every user should be able to navigate, understand and use Tashtep regardless of ability or device.

---

# Compliance Target

Standard

WCAG 2.2 AA

Target Score

100/100

Lighthouse Accessibility

100

---

# Core Principles

Perceivable

Operable

Understandable

Robust

Every screen must satisfy these four principles.

---

# Language

Primary Language

Arabic

Direction

RTL Native

Secondary Language

English

LTR Supported

Always use

lang="ar"

dir="rtl"

Never simulate RTL with CSS hacks.

---

# Typography

Arabic First

Recommended Fonts

Tajawal

IBM Plex Sans Arabic

Minimum Body Size

16px

Minimum Line Height

1.6

Maximum Line Length

75 characters

Never use tiny fonts.

---

# Color Contrast

Minimum

4.5:1

Large Text

3:1

Interactive Elements

Always visible

Never rely on color alone.

Every status must include

Text

Icon

Visual Indicator

---

# Keyboard Navigation

Every interactive element must support

Tab

Shift + Tab

Enter

Space

Escape

Arrow Keys

No mouse should be required.

---

# Focus States

Every button

Every input

Every link

Every card

must have a visible focus state.

Never remove outline.

Use

2px outline

Primary Orange

Offset 2px

---

# Screen Readers

Every page must include

Semantic HTML

ARIA Labels

Landmarks

Roles

Accessible Names

Examples

Header

Navigation

Main

Footer

Dialog

Button

Search

---

# Images

Every image requires

Alt Text

Decorative images

alt=""

Product images

Meaningful description

Never leave alt undefined.

---

# Forms

Every input requires

Label

Placeholder

Description

Error Message

Success State

Validation

Never rely on placeholder as label.

---

# Error Messages

Must be

Clear

Human readable

Specific

Actionable

Bad

"Invalid Input"

Good

"Please enter a valid email address."

---

# Buttons

Minimum Height

48px

Minimum Width

48px

Touch Friendly

Visible Focus

Readable Label

---

# Links

Every link must

Describe destination

Be distinguishable

Support keyboard navigation

Never use

Click Here

Read More

without context.

---

# Icons

Every icon button requires

aria-label

Example

Search

Close

Delete

Edit

Download

Upload

---

# Dialogs

Trap Focus

Close with Escape

Restore Focus

Accessible Title

Accessible Description

---

# Tables

Avoid traditional tables when possible.

Prefer

Cards

Lists

Timelines

Editorial Layouts

If tables are necessary

Provide

Headers

Scope

Captions

Keyboard Navigation

---

# Navigation

Every page includes

Header

Navigation

Main

Aside

Footer

Proper landmark structure.

---

# Search

Search Input

Accessible Label

Keyboard Shortcut

Visible Focus

Clear Button

---

# Empty States

Must include

Illustration

Description

Primary Action

Secondary Action

Never show blank screens.

---

# Loading States

Use

Skeletons

Progress Indicators

Loading Text

Screen Reader Announcements

---

# Animations

Duration

180ms

Reduce Motion Support

Respect

prefers-reduced-motion

Never force animations.

---

# Motion

Allow users to

Reduce

Disable

Skip

Non-essential animations.

---

# Responsive Accessibility

Desktop

1920

1600

1440

1280

1024

Tablet

768

Mobile

430

390

375

360

All layouts must remain accessible.

---

# Touch Targets

Minimum

48px

Spacing

8px

No overlapping controls.

---

# Accessibility Testing

Every release must verify

Keyboard Navigation

Screen Readers

Color Contrast

Focus Order

RTL

Reduced Motion

Responsive

Forms

Dialogs

Search

Navigation

---

# Supported Screen Readers

VoiceOver

NVDA

JAWS

TalkBack

---

# Lighthouse Targets

Accessibility

100

Performance

95+

SEO

100

Best Practices

100

---

# AI Accessibility Rules

AI must

Generate semantic HTML

Generate ARIA attributes

Generate keyboard support

Generate visible focus states

Generate proper labels

Never generate inaccessible components.

---

# Accessibility Checklist

✅ Semantic HTML

✅ Proper Heading Order

✅ Alt Text

✅ Labels

✅ Keyboard Support

✅ Focus States

✅ Contrast

✅ RTL Support

✅ Responsive

✅ Screen Reader Support

✅ Reduced Motion

---

# Definition of Accessible

A feature is complete only if

Accessible

Keyboard Navigable

Screen Reader Friendly

Responsive

RTL Compatible

Contrast Compliant

WCAG 2.2 AA Ready

Production Ready

---

# Core Principles

Accessibility First

Semantic HTML

Keyboard First

RTL Native

Human Friendly

Inclusive Design

---

# Final Vision

Every Tashtep experience should feel

Simple

Readable

Inclusive

Elegant

Accessible

Reliable

while preserving

Apple Simplicity

Stripe Clarity

Linear Precision

Notion Organization

Luxury Editorial Experience

for every user.