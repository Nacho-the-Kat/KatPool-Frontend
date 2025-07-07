import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfigFile from '@/tailwind.config.js'

export const tailwindConfig = resolveConfig(tailwindConfigFile) as any

export const getBreakpointValue = (value: string): number => {
  const screenValue = tailwindConfig.theme.screens[value]
  return +screenValue.slice(0, screenValue.indexOf('px'))
}

export const getBreakpoint = () => {
  let currentBreakpoint
  let biggestBreakpointValue = 0
  let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0
  for (const breakpoint of Object.keys(tailwindConfig.theme.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint)
    if (
      breakpointValue > biggestBreakpointValue &&
      windowWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue
      currentBreakpoint = breakpoint
    }
  }
  return currentBreakpoint
}

export const hexToRGB = (h: string): string => {
  let r = 0
  let g = 0
  let b = 0
  if (h.length === 4) {
    r = parseInt(`0x${h[1]}${h[1]}`)
    g = parseInt(`0x${h[2]}${h[2]}`)
    b = parseInt(`0x${h[3]}${h[3]}`)
  } else if (h.length === 7) {
    r = parseInt(`0x${h[1]}${h[2]}`)
    g = parseInt(`0x${h[3]}${h[4]}`)
    b = parseInt(`0x${h[5]}${h[6]}`)
  }
  return `${+r},${+g},${+b}`
}

export const formatValue = (value: number): string => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value)

export const formatThousands = (value: number): string => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value)

export const formatHashrate = (hashrate: number): string => {
  // Handle invalid inputs
  if (!Number.isFinite(hashrate) || hashrate < 0) {
    console.error('Invalid hashrate value:', hashrate);
    return 'Unavailable';
  }

  try {
    // Input is in GH/s, convert down or up in steps of 1000
    if (hashrate < 0.000001) { // < 0.000001 GH/s (< 1 KH/s)
      return `${(hashrate * 1000000000).toFixed(2)} H/s`;
    } else if (hashrate < 0.001) { // < 0.001 GH/s (< 1 MH/s)
      return `${(hashrate * 1000000).toFixed(2)} KH/s`;
    } else if (hashrate < 1) { // < 1 GH/s
      return `${(hashrate * 1000).toFixed(2)} MH/s`;
    } else if (hashrate < 1000) { // < 1 TH/s
      return `${hashrate.toFixed(2)} GH/s`;
    } else if (hashrate < 1000000) { // < 1 PH/s
      return `${(hashrate / 1000).toFixed(2)} TH/s`;
    } else if (hashrate < 1000000000) { // < 1 EH/s
      return `${(hashrate / 1000000).toFixed(2)} PH/s`;
    } else {
      return `${(hashrate / 1000000000).toFixed(2)} EH/s`;
    }
  } catch (error) {
    console.error('Error formatting hashrate:', error);
    return 'Unavailable';
  }
};

export const formatHashrateCompact = (hashrate: number): string => {
  // Handle invalid inputs
  if (!Number.isFinite(hashrate) || hashrate < 0) {
    console.error('Invalid hashrate value:', hashrate);
    return 'Unavailable';
  }

  try {
    // Input is in GH/s, convert down or up in steps of 1000
    if (hashrate < 0.000001) { // < 0.000001 GH/s (< 1 KH/s)
      return `${(hashrate * 1000000000).toFixed(1)} H/s`;
    } else if (hashrate < 0.001) { // < 0.001 GH/s (< 1 MH/s)
      return `${(hashrate * 1000000).toFixed(1)} KH/s`;
    } else if (hashrate < 1) { // < 1 GH/s
      return `${(hashrate * 1000).toFixed(1)} MH/s`;
    } else if (hashrate < 1000) { // < 1 TH/s
      return `${hashrate.toFixed(1)} GH/s`;
    } else if (hashrate < 1000000) { // < 1 PH/s
      return `${(hashrate / 1000).toFixed(1)} TH/s`;
    } else if (hashrate < 1000000000) { // < 1 EH/s
      return `${(hashrate / 1000000).toFixed(1)} PH/s`;
    } else {
      return `${(hashrate / 1000000000).toFixed(1)} EH/s`;
    }
  } catch (error) {
    console.error('Error formatting hashrate:', error);
    return 'Unavailable';
  }
};
