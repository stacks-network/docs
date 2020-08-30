import React from 'react';
import { Box, BoxProps, transition } from '@stacks/ui';
export type SvgProps = React.FC<BoxProps>;

export const SadIcon: SvgProps = ({ bg = '#E1E3E8', ...props }) => (
  <Box
    as="svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Box
      as="circle"
      transition={transition}
      // @ts-ignore
      cx="14"
      cy="14"
      r="14"
      fill={bg as string}
    />
    <path
      d="M5.83334 8.75V8.75C6.94335 10.415 9.39 10.415 10.5 8.75V8.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17.5 8.75V8.75C18.61 10.415 21.0567 10.415 22.1667 8.75V8.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 17.5001V17.5001C11.055 14.1209 16.945 14.1209 21 17.5001V17.5001"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Box>
);

export const NeutralIcon: SvgProps = ({ bg = '#E1E3E8', ...props }) => (
  <Box
    as="svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Box
      as="circle"
      transition={transition}
      // @ts-ignore
      cx="14"
      cy="14"
      r="14"
      fill={bg as string}
    />
    <path
      d="M5.83331 9.91659V9.91659C7.38689 10.0276 8.9464 10.0276 10.5 9.91659V9.91659"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17.5 9.91659V9.91659C19.0536 10.0276 20.6131 10.0276 22.1667 9.91659V9.91659"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M7 17.5H14H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Box>
);

export const HappyIcon: SvgProps = ({ bg = '#E1E3E8', ...props }) => (
  <Box
    as="svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Box
      as="circle"
      transition={transition} // @ts-ignore
      cx="14"
      cy="14"
      r="14"
      fill={bg as string}
    />
    <path
      d="M5.83331 10.5V10.5C6.94332 8.83498 9.38997 8.83498 10.5 10.5V10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17.5 10.5V10.5C18.61 8.83498 21.0567 8.83498 22.1667 10.5V10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M21 14C21 15.8565 20.2625 17.637 18.9497 18.9497C17.637 20.2625 15.8565 21 14 21C12.1435 21 10.363 20.2625 9.05025 18.9497C7.7375 17.637 7 15.8565 7 14L14 14H21Z"
      fill="currentColor"
    />
  </Box>
);
