/**
 * The state machine used here is based on the one provided
 * in react-native-web:
 *
 * https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Touchable/index.js
 */

import * as React from 'react';
import { isHoverEnabled } from '@common/utils/hover-enabled';
import { useGestureResponder } from 'react-gesture-responder';

/**
 * useTouchable
 *
 * useTouchable is a hook that attempt to emulate native touch behaviour for things
 * like list items, buttons, etc.
 *
 * const { bind, active } = useTouchable({
 *   onPress: () => console.log('hello'),
 *   disabled: false,
 *   delay: 120
 * })
 *
 */

const HIGHLIGHT_DELAY_MS = 100;
const PRESS_EXPAND_PX = 20;
const LONG_PRESS_DELAY = 500 - HIGHLIGHT_DELAY_MS;

type States =
  | 'ERROR'
  | 'NOT_RESPONDER'
  | 'RESPONDER_ACTIVE_IN'
  | 'RESPONDER_ACTIVE_OUT'
  | 'RESPONDER_PRESSED_IN'
  | 'RESPONDER_PRESSED_OUT'
  | 'RESPONDER_LONG_PRESSED_IN';

type Events =
  | 'DELAY'
  | 'RESPONDER_GRANT'
  | 'RESPONDER_RELEASE'
  | 'RESPONDER_TERMINATED'
  | 'ENTER_PRESS_RECT'
  | 'LEAVE_PRESS_RECT'
  | 'LONG_PRESS_DETECTED';

type TransitionsType = { [key in States]: TransitionType };

type TransitionType = { [key in Events]: States };

const transitions = {
  NOT_RESPONDER: {
    DELAY: 'NOT_RESPONDER',
    RESPONDER_GRANT: 'RESPONDER_ACTIVE_IN',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'NOT_RESPONDER',
    LEAVE_PRESS_RECT: 'NOT_RESPONDER',
    LONG_PRESS_DETECTED: 'NOT_RESPONDER',
  },
  RESPONDER_ACTIVE_IN: {
    DELAY: 'RESPONDER_PRESSED_IN',
    RESPONDER_GRANT: 'ERROR',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'RESPONDER_ACTIVE_IN',
    LEAVE_PRESS_RECT: 'RESPONDER_ACTIVE_OUT',
    LONG_PRESS_DETECTED: 'ERROR',
  },
  RESPONDER_ACTIVE_OUT: {
    DELAY: 'RESPONDER_PRESSED_OUT',
    RESPONDER_GRANT: 'ERROR',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'RESPONDER_ACTIVE_IN',
    LEAVE_PRESS_RECT: 'RESPONDER_ACTIVE_OUT',
    LONG_PRESS_DETECTED: 'ERROR',
  },
  RESPONDER_PRESSED_IN: {
    DELAY: 'ERROR',
    RESPONDER_GRANT: 'ERROR',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'RESPONDER_PRESSED_IN',
    LEAVE_PRESS_RECT: 'RESPONDER_PRESSED_OUT',
    LONG_PRESS_DETECTED: 'RESPONDER_LONG_PRESSED_IN',
  },
  RESPONDER_PRESSED_OUT: {
    DELAY: 'ERROR',
    RESPONDER_GRANT: 'ERROR',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'RESPONDER_PRESSED_IN',
    LEAVE_PRESS_RECT: 'RESPONDER_PRESSED_OUT',
    LONG_PRESS_DETECTED: 'ERROR',
  },
  RESPONDER_LONG_PRESSED_IN: {
    DELAY: 'ERROR',
    RESPONDER_GRANT: 'ERROR',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'RESPONDER_PRESSED_IN',
    LEAVE_PRESS_RECT: 'RESPONDER_PRESSED_OUT',
    LONG_PRESS_DETECTED: 'RESPONDER_LONG_PRESSED_IN',
  },
  ERROR: {
    DELAY: 'NOT_RESPONDER',
    RESPONDER_GRANT: 'RESPONDER_ACTIVE_IN',
    RESPONDER_RELEASE: 'NOT_RESPONDER',
    RESPONDER_TERMINATED: 'NOT_RESPONDER',
    ENTER_PRESS_RECT: 'NOT_RESPONDER',
    LEAVE_PRESS_RECT: 'NOT_RESPONDER',
    LONG_PRESS_DETECTED: 'NOT_RESPONDER',
  },
} as TransitionsType;

export type OnPressFunction = (
  e?: React.TouchEvent | React.MouseEvent | React.KeyboardEvent | Event
) => void;

export interface TouchableOptions {
  delay: number;
  longPressDelay: number;
  pressExpandPx: number;
  behavior: 'button' | 'link';
  disabled: boolean;
  terminateOnScroll: boolean;
  onPress?: OnPressFunction;
  onLongPress?: OnPressFunction;
}

const defaultOptions: TouchableOptions = {
  delay: HIGHLIGHT_DELAY_MS,
  pressExpandPx: PRESS_EXPAND_PX,
  longPressDelay: LONG_PRESS_DELAY,
  behavior: 'button',
  disabled: false,
  terminateOnScroll: true,
  onPress: undefined,
  onLongPress: undefined,
};

export function useTouchable(options: Partial<TouchableOptions> = {}) {
  const {
    onPress,
    onLongPress,
    longPressDelay,
    terminateOnScroll,
    delay,
    behavior,
    disabled: localDisabled,
  } = {
    ...defaultOptions,
    ...options,
  };
  const disabled = localDisabled;
  const ref = React.useRef<HTMLAnchorElement | HTMLDivElement | any>(null);
  const delayTimer = React.useRef<number>();
  const longDelayTimer = React.useRef<number>();
  const bounds = React.useRef<ClientRect>();
  const [hover, setHover] = React.useState(false);
  const [showHover, setShowHover] = React.useState(true);
  const [active, setActive] = React.useState(false);
  const state = React.useRef<States>('NOT_RESPONDER');

  /**
   * Transition from one state to another
   * @param event
   */

  function dispatch(event: Events) {
    const nextState = transitions[state.current][event];
    state.current = nextState;

    if (nextState === 'RESPONDER_PRESSED_IN' || nextState === 'RESPONDER_LONG_PRESSED_IN') {
      setActive(true);
    } else {
      setActive(false);
    }

    if (nextState === 'NOT_RESPONDER') {
      clearTimeout(delayTimer.current);
      clearTimeout(longDelayTimer.current);
    }
  }

  // create a pan responder to handle mouse / touch gestures
  const { bind, terminateCurrentResponder } = useGestureResponder({
    onStartShouldSet: () => true,
    onGrant: () => {
      onStart(isHoverEnabled() ? 0 : undefined);
    },
    onRelease: (_state, e) => onEnd(e),
    onMove: (_state, e) => onTouchMove(e),
    onTerminate: _state => onTerminate(),
  });

  /**
   * Emit a press event if not disabled
   * @param e
   */

  function emitPress(e: React.TouchEvent | React.MouseEvent | React.KeyboardEvent | Event) {
    if (!disabled && onPress) {
      onPress(e);
    }
  }

  function emitLongPress() {
    if (!disabled && onLongPress) {
      onLongPress();
    }
  }

  function bindScroll() {
    if (terminateOnScroll) {
      document.addEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      });
    }
  }

  function unbindScroll() {
    document.removeEventListener('scroll', onScroll, true);
  }

  function afterDelay() {
    dispatch('DELAY');
  }

  /**
   * Get our initial bounding box clientRect and set any delay
   * timers if necessary.
   * @param delayPressMs
   */

  function onStart(delayPressMs = delay) {
    dispatch('RESPONDER_GRANT');
    bounds.current = ref.current?.getBoundingClientRect();
    delayTimer.current = delayPressMs > 0 ? window.setTimeout(afterDelay, delayPressMs) : undefined;

    if (delayPressMs === 0) {
      dispatch('DELAY');
    }

    longDelayTimer.current = window.setTimeout(afterLongDelay, longPressDelay);

    bindScroll();
    setShowHover(false);
  }

  function afterLongDelay() {
    dispatch('LONG_PRESS_DETECTED');
    emitLongPress();
  }

  // onTerminate should be disambiguated from onRelease
  // because it should never trigger onPress events.
  function onTerminate() {
    if (state.current === 'NOT_RESPONDER') {
      return;
    }

    dispatch('RESPONDER_RELEASE');
    setShowHover(true);
    unbindScroll();
  }

  function onEnd(e?: React.TouchEvent | React.MouseEvent | React.KeyboardEvent | Event) {
    // consider unbinding the end event instead
    if (state.current === 'NOT_RESPONDER') {
      return;
    }

    if (
      e &&
      (state.current === 'RESPONDER_ACTIVE_IN' || state.current === 'RESPONDER_PRESSED_IN')
    ) {
      emitPress(e);
    }

    dispatch('RESPONDER_RELEASE');
    setShowHover(true);
    unbindScroll();
  }

  function isWithinActiveBounds(
    clientX: number,
    clientY: number,
    rect: ClientRect,
    expandPx: number = PRESS_EXPAND_PX
  ) {
    return (
      clientX > rect.left - expandPx &&
      clientY > rect.top - expandPx &&
      clientX < rect.right + expandPx &&
      clientY < rect.bottom + expandPx
    );
  }

  /**
   * Determine if the touch remains in the active bounds
   * @param e
   */

  function onTouchMove(e: any) {
    if (state.current === 'NOT_RESPONDER' || state.current === 'ERROR') {
      return;
    }

    clearTimeout(longDelayTimer.current);

    const { clientX, clientY } = e.touches && e.touches[0] ? e.touches[0] : e;
    const withinBounds = isWithinActiveBounds(clientX, clientY, bounds.current);

    if (withinBounds) {
      dispatch('ENTER_PRESS_RECT');
    } else {
      dispatch('LEAVE_PRESS_RECT');
    }
  }

  /**
   * Scrolling cancels all responder events. This enables
   * the user to scroll without selecting something
   */

  function onScroll() {
    unbindScroll();
    dispatch('RESPONDER_TERMINATED');
  }

  /**
   * If our mouse leaves we terminate our responder,
   * even if our press remains down. This emulates
   * native mouse behaviour.
   * @param e
   */

  function onMouseLeave() {
    if (hover) {
      setHover(false);
    }
    if (!showHover) {
      setShowHover(true);
    }
    if (state.current !== 'NOT_RESPONDER') {
      terminateCurrentResponder();
    }
  }

  function onMouseEnter() {
    if (!hover) {
      setHover(true);
    }
  }

  /**
   * Handle timer and disabled side-effects
   */

  React.useEffect(() => {
    return () => {
      clearTimeout(delayTimer.current);
      clearTimeout(longDelayTimer.current);
      unbindScroll();
    };
  }, []);

  React.useEffect(() => {
    if (disabled && state.current !== 'NOT_RESPONDER') {
      dispatch('RESPONDER_TERMINATED');
      setShowHover(true);
    }
  }, [disabled]);

  /**
   * Keyboard support
   * button:
   *   onEnterDown -> onPress
   *   onSpaceUp -> onPress
   * Prevent default.
   *
   * link: Don't prevent default
   */

  function onKey(e: React.KeyboardEvent) {
    const ENTER = 13;
    const SPACE = 32;

    if (e.type === 'keydown' && e.which === SPACE) {
      onStart(0);
    } else if (e.type === 'keydown' && e.which === ENTER) {
      emitPress(e);
    } else if (e.type === 'keyup' && e.which === SPACE) {
      onEnd(e);
    } else {
      return;
    }

    e.stopPropagation();

    if (!(e.which === ENTER && behavior === 'link')) {
      e.preventDefault();
    }
  }

  return {
    bind: {
      ...bind,
      onKeyUp: onKey,
      onKeyDown: onKey,
      onMouseEnter,
      onMouseLeave,
      ref,
    },
    active: !disabled && active,
    hover: isHoverEnabled() && !disabled && hover && showHover,
  };
}
