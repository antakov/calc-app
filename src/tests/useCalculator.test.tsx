import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from './../hooks/useCalculator';

describe('useCalculator (basic)', () => {
  it('inputs digits and dot', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('1'));
    act(() => result.current.inputDigit('2'));
    act(() => result.current.inputDot());
    act(() => result.current.inputDigit('3'));

    expect(result.current.current).toBe('12.3');
  });

  it('clearAll resets state', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('9'));
    act(() => result.current.clearAll());

    expect(result.current.current).toBe('0');
    expect(result.current.prev).toBe(null);
    expect(result.current.operator).toBe(null);
  });

  it('deleteLast removes last char (and stops at "0")', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('7'));
    act(() => result.current.inputDigit('8'));
    act(() => result.current.deleteLast());
    expect(result.current.current).toBe('7');

    act(() => result.current.deleteLast());
    expect(result.current.current).toBe('0');
  });

  it('toggleSign toggles minus', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('5'));
    act(() => result.current.toggleSign());
    expect(result.current.current).toBe('-5');

    act(() => result.current.toggleSign());
    expect(result.current.current).toBe('5');
  });

  it('percent divides current by 100', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('5'));
    act(() => result.current.inputDigit('0')); // 50
    act(() => result.current.percent());
    expect(result.current.current).toBe('0.5');
  });

  it('basic add: 12 + 3 = 15', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('1'));
    act(() => result.current.inputDigit('2'));
    act(() => result.current.chooseOp('+'));
    act(() => result.current.inputDigit('3'));
    act(() => result.current.equals());

    expect(result.current.current).toBe('15');
    expect(result.current.prev).toBe(null);
    expect(result.current.operator).toBeNull();
  });

  it('basic multiply: 7 × 8 = 56', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('7'));
    act(() => result.current.chooseOp('×'));
    act(() => result.current.inputDigit('8'));
    act(() => result.current.equals());

    expect(result.current.current).toBe('56');
  });

  it('division by zero returns "Error"', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('9'));
    act(() => result.current.chooseOp('÷'));
    act(() => result.current.inputDigit('0'));
    act(() => result.current.equals());

    expect(result.current.current).toBe('Error');
  });

  it('chained ops compute progressively: 5 + 2 × 3 = 21 (left-associative, no precedence)', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('5'));
    act(() => result.current.chooseOp('+'));
    act(() => result.current.inputDigit('2'));
    act(() => result.current.chooseOp('×'));
    act(() => result.current.inputDigit('3'));
    act(() => result.current.equals());

    expect(result.current.current).toBe('21');
  });

  it('overwrite after equals: 2 + 3 = (5), then input 7 -> starts new number "7"', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => result.current.inputDigit('2'));
    act(() => result.current.chooseOp('+'));
    act(() => result.current.inputDigit('3'));
    act(() => result.current.equals());
    expect(result.current.current).toBe('5');

    act(() => result.current.inputDigit('7'));
    expect(result.current.current).toBe('7');
  });
});
