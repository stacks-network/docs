import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '../common/constants';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/api/')) {
    return undefined;
  }
  const shouldHandleLocale =
    !request.nextUrl.pathname.includes('/favicon') &&
    !request.nextUrl.pathname.includes('/static/');

  const locale = request.headers.get('accept-language').substr(0, 2);
  if ((shouldHandleLocale && !SUPPORTED_LANGUAGES.includes(locale)) || locale === 'en') {
    return undefined;
  } else if (!request.nextUrl.pathname.includes(locale)) {
    return NextResponse.redirect(`/${locale}${request.nextUrl.pathname}`);
  }
}
