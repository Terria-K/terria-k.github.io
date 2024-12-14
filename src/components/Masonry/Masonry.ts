export type Item<AnyComponent> = {
  type: AnyComponent,  
  props?: Record<string, any>
}

export interface MasonryProps {
  items: Item<(props: any) => any>[],
  gap: number,
  columns: number
}