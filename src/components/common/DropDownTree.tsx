import React, { useMemo } from "react";
import Dropdownz from "components/uiCore/form/Dropdown";
import { classNames } from "primereact/utils";

/* ======================
   Types
====================== */
export interface FlatItem {
  id: number;
  name: string;
  parent_id: number;
}

export interface DropDownTreeProps {
  data: FlatItem[];

  value?: any;
  onChange?: (e: any) => void;

  label?: string;
  placeholder?: string;
  className?: string;

  /** Disable các node cha (mặc định: true) */
  disableParent?: boolean;
}

/* ======================
   Helpers
====================== */
const buildTree = (data: FlatItem[]) => {
  const map: Record<number, any> = {};
  const roots: any[] = [];

  data.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  data.forEach(item => {
    if (item.parent_id === 0) {
      roots.push(map[item.id]);
    } else {
      map[item.parent_id]?.children.push(map[item.id]);
    }
  });

  return roots;
};

const flattenTree = (nodes: any[], level = 0): any[] =>
  nodes.flatMap(n => [
    {
      label: n.name,
      value: n.id,
      level,
      isParent: n.children && n.children.length > 0
    },
    ...(n.children ? flattenTree(n.children, level + 1) : [])
  ]);

/* ======================
   Component
====================== */
export const DropDownTree = (props:any) => {
const {data, value, onChange, label, placeholder, className, disableParent, ...prop } = props;
  /* Build dropdown options */
  const dropdownOptions = useMemo(() => {
    const tree = buildTree(data);

    return flattenTree(tree).map(o => ({
      ...o,
      disabled: disableParent ? o.isParent : false
    }));
  }, [data, disableParent]);

  /* Render item with indent */
    const itemTemplate = (option: any) => (
    <div
        className={classNames(
        'dropdown-item',
        `level-${option.level}`,
        {
            'parent-item': option.isParent,
            'leaf-item': !option.isParent
        }
        )}
    >
        {option.label}
    </div>
    );

  return (
    <span className="p-float-label w-full">
      <Dropdownz
        value={value}
        onChange={onChange}
        options={dropdownOptions}
        optionLabel="label"
        optionValue="value"
        itemTemplate={itemTemplate}
        filter
        placeholder={placeholder}
        className={classNames("w-full", className)}
        {...prop}
      />
      {label && <label className="label-sm">{label}</label>}
    </span>
  );
};
