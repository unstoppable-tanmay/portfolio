import { HierarchyRectangularNode } from "d3";

export type TreemapNode = HierarchyRectangularNode<StackItem>;

export type StackItem = {
  name: string;
  percentage: number;
  description?: string;
  children?: StackItem[];
};

export interface TechStackTreemapProps {
  stacks: Omit<StackItem, "children">[];
  className?: string;
}
