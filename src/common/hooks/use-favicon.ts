import { useColorMode } from '@common/hooks/use-color-mode';

export const useFaviconName = () => {
  const [mode] = useColorMode();
  const darkmode = mode === 'dark';
  return `favicon-${darkmode ? 'light' : 'dark'}.svg`;
};
