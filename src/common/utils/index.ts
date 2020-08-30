import { Children, isValidElement, ReactNode, ReactElement, ReactText } from 'react';
import { Property } from 'csstype';
import { color } from '@stacks/ui';
import { ColorsStringLiteral } from '@stacks/ui';

const camelToKebab = (string: string) =>
  string
    .toString()
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();

export const slugify = (string: string): string =>
  string
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

export const capitalize = ([s, ...tring]: string): string => [s.toUpperCase(), ...tring].join('');

export const border = (
  width = 1,
  style: Property.BorderStyle = 'solid',
  _color: ColorsStringLiteral = 'border'
): string => `${width}px ${style} ${color(_color)}`;

// https://github.com/fernandopasik/react-children-utilities/blob/master/src/lib/hasChildren.ts
const hasChildren = (element: ReactNode): element is ReactElement<{ children: ReactNode[] }> =>
  isValidElement<{ children?: ReactNode[] }>(element) && Boolean(element.props.children);

// https://github.com/fernandopasik/react-children-utilities/blob/master/src/lib/onlyText.ts

export const childToString = (child?: ReactText | boolean | unknown | null): string => {
  if (typeof child === 'undefined' || child === null || typeof child === 'boolean') {
    return '';
  }

  if (JSON.stringify(child) === '{}') {
    return '';
  }

  return (child as string | number).toString();
};

export const onlyText = (children: ReactNode): string => {
  if (!(children instanceof Array) && !isValidElement(children)) {
    return childToString(children);
  }

  return Children.toArray(children).reduce((text: string, child: ReactNode): string => {
    let newText = '';

    if (isValidElement(child) && hasChildren(child)) {
      newText = onlyText(child.props.children) + '\n';
    } else if (isValidElement(child) && !hasChildren(child)) {
      newText = '';
    } else {
      newText = childToString(child);
    }

    return text.concat(newText);
  }, '') as string;
};

const getTitleFromHeading = (headings?: any[]) =>
  headings?.length
    ? typeof headings[0] === 'string'
      ? headings[0]
      : headings[0].content
    : undefined;

export const getTitle = ({ title, headings }: { title?: string; headings?: any[] }): string =>
  title || getTitleFromHeading(headings);

export const transition = (timing = '0.2s', properties = 'all') =>
  `${properties} ${timing} cubic-bezier(0.23, 1, 0.32, 1)`;

export const getCategory = (pathname: string) => {
  const arr = pathname.split('/');
  if (arr.length > 1) {
    return arr[1];
  }
  return undefined;
};

export const getSlug = (asPath: string) => {
  if (asPath.includes('#')) {
    const slug = asPath.split('#')[1];
    return slug;
  }
  return;
};

interface CancelablePromise {
  promise: Promise<any>;
  cancel: () => void;
}

/** Make a Promise "cancelable".
 *
 * Rejects with {isCanceled: true} if canceled.
 *
 * The way this works is by wrapping it with internal hasCanceled_ state
 * and checking it before resolving.
 */
export const makeCancelable = (promise: Promise<any>): CancelablePromise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    void promise.then((val: any) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)));
    void promise.catch((error: any) =>
      hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
