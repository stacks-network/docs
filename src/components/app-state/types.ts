export interface State {
  mobileMenu: boolean;
  activeSlug: string;
  slugInView?: string;
  setState: (value: any) => void;
}
