export default function rehypeFilter(
  this: import('unified').Processor<void, import('hast').Root, void, void>,
  settings_0: Options
):
  | void
  | import('unified').Transformer<import('hast').Root, import('hast').Root>
export type Node = import('unist').Node
export type Root = import('hast').Root
export type Element = import('hast').Element
export type AllowElement = (
  element: Element,
  index: number,
  parent: Element | Root
) => boolean | undefined
export type Options = {
  allowedElements?: string[] | undefined
  disallowedElements?: string[] | undefined
  allowElement?: AllowElement | undefined
  unwrapDisallowed?: boolean | undefined
}
