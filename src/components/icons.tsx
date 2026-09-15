import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps, children: ReactNode) {
  const { size, ...rest } = props;
  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M20 7H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z" />
      <path d="M3 10.5V7a3 3 0 0 1 3-3h9.5" />
      <circle cx="17" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
    </>
  );
}

export function BarChartIcon(props: IconProps) {
  return base(
    props,
    <>
      <line x1="4" y1="21" x2="20" y2="21" />
      <line x1="7" y1="20" x2="7" y2="12" />
      <line x1="13" y1="20" x2="13" y2="4" />
      <line x1="19" y1="20" x2="19" y2="9" />
    </>
  );
}

export function TargetIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  );
}

export function FileTextIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
      <path d="M14 2.5v6h5" />
      <line x1="8.5" y1="13" x2="15.5" y2="13" />
      <line x1="8.5" y1="17" x2="13" y2="17" />
    </>
  );
}

export function SunIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2.5" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="21.5" />
      <line x1="4.2" y1="12" x2="2.5" y2="12" />
      <line x1="21.5" y1="12" x2="19.8" y2="12" />
      <line x1="5.6" y1="5.6" x2="4.2" y2="4.2" />
      <line x1="19.8" y1="19.8" x2="18.4" y2="18.4" />
      <line x1="5.6" y1="18.4" x2="4.2" y2="19.8" />
      <line x1="19.8" y1="4.2" x2="18.4" y2="5.6" />
    </>
  );
}

export function MoonIcon(props: IconProps) {
  return base(props, <path d="M20.5 13.5a8.5 8.5 0 1 1-9-11 7 7 0 0 0 9 11Z" />);
}

export function PencilIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M12.5 19.5h8" />
      <path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7.5 18.4l-4 1 1-4Z" />
    </>
  );
}

export function TrashIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 6.5h16" />
      <path d="M18.2 6.5 17.4 19a2 2 0 0 1-2 1.9H8.6a2 2 0 0 1-2-1.9L5.8 6.5" />
      <path d="M9.5 6.5V4.3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2.2" />
      <line x1="10.2" y1="10.5" x2="10.2" y2="16.3" />
      <line x1="13.8" y1="10.5" x2="13.8" y2="16.3" />
    </>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M10.4 4.15 2.35 18a2 2 0 0 0 1.7 3h15.9a2 2 0 0 0 1.7-3L13.6 4.15a2 2 0 0 0-3.2 0Z" />
      <line x1="12" y1="9.5" x2="12" y2="13.5" />
      <circle cx="12" cy="16.7" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth={1.6} />
    </>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return base(props, <polyline points="14.5 18 8.5 12 14.5 6" />);
}

export function ChevronRightIcon(props: IconProps) {
  return base(props, <polyline points="9.5 18 15.5 12 9.5 6" />);
}

export function LogOutIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M9.5 20.5H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h3.5" />
      <polyline points="15.5 16 20 12 15.5 8" />
      <line x1="20" y1="12" x2="9.5" y2="12" />
    </>
  );
}

export function PlusIcon(props: IconProps) {
  return base(
    props,
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  );
}

export function InboxIcon(props: IconProps) {
  return base(
    props,
    <>
      <polyline points="21.5 12.5 16 12.5 14 15.5 10 15.5 8 12.5 2.5 12.5" />
      <path d="M5.6 5.3 2.5 12.5v5.8a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-5.8L18.4 5.3a2 2 0 0 0-1.85-1.3H7.45a2 2 0 0 0-1.85 1.3Z" />
    </>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.4 5.4 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}
