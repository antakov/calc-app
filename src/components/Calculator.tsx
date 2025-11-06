import {useCallback, useEffect, useMemo} from 'react';
import './styles.css';
import { useCalculator } from '../hooks/useCalculator';
import type { Op } from '../hooks/useCalculator';

type KeyHandlerMap = Partial<Record<string, () => void>>;

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
    { label: 'AC', kind: 'clear', className: 'btn-func', ariaLabel: 'Clear' },
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

  const calc = useCalculator();

  const onPress = useCallback((btn: BtnDef) => {
    switch (btn.kind) {
      case 'digit':   return calc.inputDigit(btn.value!);
      case 'dot':     return calc.inputDot();
      case 'op':      return calc.chooseOp(btn.value as Exclude<Op, null>);
      case 'eq':      return calc.equals();
      case 'del':     return calc.deleteLast();
      case 'clear':   return calc.clearAll();
      case 'sign':    return calc.toggleSign();
      case 'percent': return calc.percent();
    }
  }, [calc]);

  useEffect(() => {
    const handlers: KeyHandlerMap = {
      '.': () => calc.inputDot(),
      Escape: () => calc.clearAll(),
      Backspace: () => calc.deleteLast(),
      Enter: () => calc.equals(),
      '=': () => calc.equals(),
      '+': () => calc.chooseOp('+'),
      '-': () => calc.chooseOp('-'),
      '*': () => calc.chooseOp('×'),
      '/': () => calc.chooseOp('÷'),
      '%': () => calc.percent(),
      // digits
      '0': () => calc.inputDigit('0'),
      '1': () => calc.inputDigit('1'),
      '2': () => calc.inputDigit('2'),
      '3': () => calc.inputDigit('3'),
      '4': () => calc.inputDigit('4'),
      '5': () => calc.inputDigit('5'),
      '6': () => calc.inputDigit('6'),
      '7': () => calc.inputDigit('7'),
      '8': () => calc.inputDigit('8'),
      '9': () => calc.inputDigit('9'),
    };

    const onKey = (e: KeyboardEvent) => {
      const h = handlers[e.key];
      if (h) { e.preventDefault(); h(); }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [calc]);


  const grid = useMemo(() => (
    <div className="grid">
      {LAYOUT.flatMap((row, rIdx) =>
        row.map((btn, cIdx) => (
          <button
            key={`${rIdx}-${cIdx}`}
            className={`btn ${btn.className ?? ''}`.trim()}
            onClick={() => onPress(btn)}
            aria-label={btn.ariaLabel ?? btn.label}
            style={btn.colSpan ? { gridColumn: `span ${btn.colSpan}` } : {}}
          >
            {btn.label}
          </button>
        ))
      )}
    </div>
  ), [onPress]);

  return (
    <div className="calc">
      <div className="display" aria-live="polite">
        <div className="mini">
          {calc.prev && (calc.operator as Op)
            ? `${calc.prev} ${calc.operator}`
            : '\u00A0'}
        </div>
        <div className="main">{calc.current}</div>
      </div>
      {grid}
    </div>
  );
}
