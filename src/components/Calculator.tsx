import { useMemo } from 'react';
import './styles.css';

type BtnKind = 'digit' | 'dot' | 'op' | 'func' | 'eq' | 'del' | 'clear' | 'sign' | 'percent';
type BtnDef = {
    label: string;
    kind: BtnKind;
    value?: string;
    className?: string;
    ariaLabel?: string;
    colSpan?: number;
};

const LAYOUT: BtnDef[][] = [
  [
    { label: 'C', kind: 'clear', className: 'btn-func', ariaLabel: 'Clear' },
    { label: '+/-', kind: 'sign',  className: 'btn-func', ariaLabel: 'Toggle sign' },
    { label: '%', kind: 'percent', className: 'btn-func', ariaLabel: 'Percent' },
    { label: '÷', kind: 'op', value: '÷', className: 'btn-op', ariaLabel: 'Divide' },
  ],
  [
    { label: '7', kind: 'digit', value: '7' },
    { label: '8', kind: 'digit', value: '8' },
    { label: '9', kind: 'digit', value: '9' },
    { label: '×', kind: 'op', value: '×', className: 'btn-op', ariaLabel: 'Multiply' },
  ],
  [
    { label: '4', kind: 'digit', value: '4' },
    { label: '5', kind: 'digit', value: '5' },
    { label: '6', kind: 'digit', value: '6' },
    { label: '−', kind: 'op', value: '-', className: 'btn-op', ariaLabel: 'Minus' },
  ],
  [
    { label: '1', kind: 'digit', value: '1' },
    { label: '2', kind: 'digit', value: '2' },
    { label: '3', kind: 'digit', value: '3' },
    { label: '+', kind: 'op', value: '+', className: 'btn-op', ariaLabel: 'Plus' },
  ],
  [
    { label: '⌫', kind: 'del', ariaLabel: 'Backspace' },
    { label: '0', kind: 'digit', value: '0' },
    { label: '.', kind: 'dot', ariaLabel: 'Decimal point' },
    { label: '=', kind: 'eq', className: 'btn-eq', ariaLabel: 'Equals' },
  ],
];

export default function Calculator() {
  const grid = useMemo(() => (
    <div className="grid">
      {LAYOUT.flatMap((row, rIdx) =>
        row.map((btn, cIdx) => (
          <button
            key={`${rIdx}-${cIdx}`}
            className={`btn ${btn.className ?? ''}`.trim()}
            onClick={() => {}}
            aria-label={btn.ariaLabel ?? btn.label}
            style={btn.colSpan ? { gridColumn: `span ${btn.colSpan}` } : {}}
          >
            {btn.label}
          </button>
        ))
      )}
    </div>
  ), []);

  return (
    <div className="calc">
      <div className="display" aria-live="polite">
        <div className="mini">
                    000
        </div>
        <div className="main">000</div>
      </div>
      {grid}
    </div>
  );
}
