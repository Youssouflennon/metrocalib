import React from "react";

interface PermissionNode {
  id: number;
  name: string;
  children?: PermissionNode[];
}

interface Props {
  node: PermissionNode;
  selected: Set<number>;
  toggle: (id: number) => void;
}

export const PermissionTreeNode: React.FC<Props> = ({
  node,
  selected,
  toggle,
}) => {
  const isChecked = selected.has(node.id);

  return (
    <div className="ml-4 my-1">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => toggle(node.id)}
        />
        <span>{node.name}</span>
      </label>
      {node.children &&
        node.children.map((child) => (
          <PermissionTreeNode
            key={child.id}
            node={child}
            selected={selected}
            toggle={toggle}
          />
        ))}
    </div>
  );
};
