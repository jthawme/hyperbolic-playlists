import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { clickOutside } from "../../../utils/utils";

import styles from "./Select.module.scss";

type Option = {
  value: any;
  label: any;
};

interface HyperSelectProps {
  className?: string;
  value?: any;
  onValue: (value: any) => void;
  items: Option[];
}

const HyperSelect: React.FC<HyperSelectProps> = ({
  items,
  className,
  onValue,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return clickOutside(selectRef.current, () => {
      setOpen(false);
    });
  }, []);

  const reportValue = useCallback((val: any) => {
    onValue(val);
    setOpen(false);
  }, []);

  const currentValue = useMemo(() => {
    return items.find((i) => i.value === value)?.label || "-";
  }, [value, items]);

  return (
    <span
      ref={selectRef}
      className={classNames(
        styles.select,
        { [styles.empty]: !value },
        className
      )}
    >
      <span onClick={() => setOpen(!open)} className={styles.input}>
        {currentValue}
      </span>
      {open && (
        <span className={styles.dropdown}>
          {items.map(({ value, label }) => (
            <span
              key={value}
              className={styles.option}
              onClick={() => reportValue(value)}
            >
              {label}
            </span>
          ))}
        </span>
      )}
    </span>
  );
};

export { HyperSelect };
