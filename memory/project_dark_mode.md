---
name: project-dark-mode
description: Dark mode implementation status and pattern used across the Fitopia app
metadata:
  type: project
---

Dark mode is now fully implemented across all screens in the Fitopia app.

**Why:** User requested full dark mode support as a pending feature.

**How to apply:** When adding new screens, always follow the pattern below. Never hardcode colors.

## Pattern Used

Every screen follows this pattern:
```js
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';

export default function MyScreen() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);
  // ...
}

function makeStyles(colors) {
  return StyleSheet.create({ ... });
}
```

## Shared Onboarding Styles

`components/onboardingStyles.js` exports `makeOnboardingStyles(colors)` (a function, not a static object). All onboarding steps call it:
```js
import { makeOnboardingStyles } from '../../components/onboardingStyles';
const styles = makeOnboardingStyles(colors);
```

## Exceptions

- `app/workout/cardio.js` — intentionally uses workout-phase colors (red/blue/green). No theme needed.
- `app/onboarding/complete.js` — always blue background by design. Button uses hardcoded `#FFFFFF`. `colors.blue` used for button text only via dynamic `colors`.
- `app/_layout.js`, `app/(tabs)/_layout.js`, `app/onboarding/_layout.js` — layout-only files, no color styling needed.

## Status

Fully complete as of 2026-08-13. All screens converted.
