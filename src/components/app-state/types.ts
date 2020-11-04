export interface State {
  mobileMenu: boolean;
  activeSlug: string;
  slugInView?: string;
  setState: (value: any) => void;
  routes: any;
  searchModal: 'open' | 'closed';
}
