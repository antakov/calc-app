import { useCallback, useMemo, useState } from 'react';

export type Op = '+' | '-' | '×' | '÷' | null;

function compute(aStr: string, bStr: string, op: Op): string {
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);
  if (Number.isNaN(a) || Number.isNaN(b) || !op) return aStr;

  let res: number;
  switch (op) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '×': res = a * b; break;
    case '÷': res = b === 0 ? NaN : a / b; break;
    default:  res = a;
  }
  return String(res);
}

export function useCalculator() {
  const [current, setCurrent] = useState<string>('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [operator, setOperator] = useState<Op>(null);
  const [overwrite, setOverwrite] = useState<boolean>(false);

  const inputDigit = useCallback((d: string) => {
    setCurrent((c) => {
      if (overwrite) { setOverwrite(false); return d; }
      if (c === '0') return d;
      return c + d;
    });
  }, [overwrite]);

  const inputDot = useCallback(() => {
    setCurrent((c) => {
      if (overwrite) { setOverwrite(false); return '0.'; }
      if (c.includes('.')) return c;
      return c + '.';
    });
  }, [overwrite]);

  const clearAll = useCallback(() => {
    setCurrent('0'); setPrev(null); setOperator(null); setOverwrite(false);
  }, []);

  const deleteLast = useCallback(() => {
    setCurrent((c) => (overwrite ? '0' : (c.length > 1 ? c.slice(0, -1) : '0')));
    setOverwrite(false);
  }, [overwrite]);

  const toggleSign = useCallback(() => {
    setCurrent((c) => (c.startsWith('-') ? c.slice(1) : (c === '0' ? '0' : '-' + c)));
  }, []);

  const percent = useCallback(() => {
    setCurrent((c) => String(parseFloat(c || '0') / 100));
  }, []);

  const chooseOp = useCallback((next: Exclude<Op, null>) => {
    setCurrent((c) => {
      if (prev === null) {
        setPrev(c);
      } else if (!overwrite) {
        setPrev(compute(prev, c, operator));
      }
      setOperator(next);
      setOverwrite(true);
      return c;
    });
  }, [operator, prev, overwrite]);

  const equals = useCallback(() => {
    if (prev === null || !operator) return;
    setCurrent((c) => {
      const res = compute(prev, c, operator);
      setPrev(null); setOperator(null); setOverwrite(true);
      return res === 'NaN' || res === 'Infinity' || res === '-Infinity' ? 'Error' : res;
    });
  }, [operator, prev]);

  return useMemo(() => ({
    current,
    prev,
    operator,
    inputDigit,
    inputDot,
    clearAll,
    deleteLast,
    toggleSign,
    percent,
    chooseOp,
    equals
  }), [current, prev, operator, inputDigit, inputDot, clearAll, deleteLast, toggleSign, percent, chooseOp, equals]);
}
