import { useState, useCallback, useEffect, useRef } from 'react';

import {
  OnBeforeCloseCallback,
  RefRegistryEntry,
  UseToggleReturnType,
} from './types';

let documentClickHandlerRegistered = false;
let htmlElementInstance: HTMLElement | null = null;
const refsRegistry: RefRegistryEntry[] = [];

const getHtmlElement = (): HTMLElement | null => {
  if (htmlElementInstance) {
    return htmlElementInstance;
  }

  htmlElementInstance = document.querySelector('html');

  return htmlElementInstance;
};

const documentClickHandler = (event: MouseEvent): void => {
  refsRegistry.forEach(
    ({ element, toggleOff, toggleState, onBeforeCloseCallbacksRef }) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const htmlElement = getHtmlElement();
      if (
        !htmlElement ||
        !htmlElement.contains(event.target) ||
        element.contains(event.target) ||
        !toggleState
      ) {
        return;
      }

      const eventTargetElement = event.target;
      const onBeforeCallbackShouldClose =
        onBeforeCloseCallbacksRef.current.some(
          (callback) => callback(eventTargetElement) === false,
        );

      if (onBeforeCallbackShouldClose) {
        return;
      }

      toggleOff();
    },
  );
};

const useToggle = ({
  defaultToggleState = false,
}: {
  defaultToggleState?: boolean;
} = {}): UseToggleReturnType => {
  const [toggleState, setToggleState] = useState(defaultToggleState);
  const onBeforeCloseCallbacksRef = useRef<OnBeforeCloseCallback[]>([]);

  const toggle = useCallback(() => {
    setTimeout(() => {
      setToggleState((currentToggleState) => !currentToggleState);
    });
  }, []);

  const toggleOff = useCallback(() => {
    setTimeout(() => {
      setToggleState(false);
    });
  }, []);

  const toggleOn = useCallback(() => {
    setTimeout(() => {
      setToggleState(true);
    });
  }, []);

  useEffect(() => {
    if (!documentClickHandlerRegistered) {
      documentClickHandlerRegistered = true;
      document.addEventListener('click', documentClickHandler);
    }
  }, []);

  const registerContainerRef = useCallback(
    (ref: HTMLElement | null): void => {
      const currentEntryIndex = refsRegistry.findIndex(
        ({ toggleOff: entryToggleOff }) => entryToggleOff === toggleOff,
      );

      if (!ref && currentEntryIndex >= 0) {
        refsRegistry.splice(currentEntryIndex, 1);

        return;
      }

      if (ref && currentEntryIndex < 0) {
        refsRegistry.push({
          onBeforeCloseCallbacksRef,
          element: ref,
          toggleOff,
          toggleState,
        });
      }
    },
    [toggleOff, toggleState],
  );

  const useRegisterOnBeforeCloseCallback = useCallback(
    (callback: OnBeforeCloseCallback) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        onBeforeCloseCallbacksRef.current.push(callback);

        return () => {
          onBeforeCloseCallbacksRef.current =
            onBeforeCloseCallbacksRef.current.filter(
              (entry) => entry !== callback,
            );
        };
      }, [callback]);
    },
    [],
  );

  return [
    toggleState,
    {
      toggle,
      toggleOn,
      toggleOff,
      registerContainerRef,
      useRegisterOnBeforeCloseCallback,
    },
  ];
};

export default useToggle;
