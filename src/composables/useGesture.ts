import {createGesture} from "@ionic/vue";

const TIMEOUT = 500;

export const useGesture = () => {
  const longPress = (el: Node, callback: () => void) => {
    let timeout: any;

    const gesture = createGesture({
      gestureName: "long-press",
      el,
      threshold: 0,
      onStart: () => {
        clearGestureTimeout();

        timeout = setTimeout(() => {
          callback()

          timeout = undefined;
        }, TIMEOUT);
      },
      onMove: (detail) => {
        // Allow slight movement; Otherwise, cancel
        if (detail.deltaX <= 10 && detail.deltaY <= 10) {
          return;
        }

        clearGestureTimeout()
      },
      onEnd: () => clearGestureTimeout()
    });

    const clearGestureTimeout = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined
      }
    }

    return gesture;
  }

  return { longPress }
}