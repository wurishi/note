window.easing = {
  linear: (k) => k,
  quadraticIn: (k) => k * k,
  quadraticOut: (k) => k * (2 - k),
  quadraticInOut: (k) =>
    (k *= 2) < 1 ? 0.5 * k * k : -0.5 * (--k * (k - 2) - 1),
  cubicIn: (k) => k * k * k,
  cubicOut: (k) => --k * k * k + 1,
  cubicInOut: (k) =>
    (k *= 2) < 1 ? 0.5 * k * k * k : 0.5 * ((k -= 2) * k * k + 2),
  quarticIn: (k) => k * k * k * k,
  quarticOut: (k) => 1 - --k * k * k * k,
  quarticInOut: (k) =>
    (k *= 2) < 1 ? 0.5 * k * k * k * k : -0.5 * ((k -= 2) * k * k * k - 2),
  quinticIn: (k) => k * k * k * k * k,
  quinticOut: (k) => --k * k * k * k * k + 1,
  quinticInOut: (k) =>
    (k *= 2) < 1
      ? 0.5 * k * k * k * k * k
      : 0.5 * ((k -= 2) * k * k * k * k + 2),
  sinusoidalIn: (k) => 1 - Math.cos((k * Math.PI) / 2),
  sinusoidalOut: (k) => Math.sin((k * Math.PI) / 2),
  sinusoidalInOut: (k) => 0.5 * (1 - Math.cos(Math.PI * k)),
  exponentialIn: (k) => (k === 0 ? 0 : Math.pow(1024, k - 1)),
  exponentialOut: (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
  exponentialInOut: (k) =>
    k === 0
      ? 0
      : k === 1
      ? 1
      : (k *= 2) < 1
      ? 0.5 * Math.pow(1024, k - 1)
      : 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2),
  circularIn: (k) => 1 - Math.sqrt(1 - k * k),
  circularOut: (k) => Math.sqrt(1 - --k * k),
  circularInOut: (k) =>
    (k *= 2) < 1
      ? -0.5 * (Math.sqrt(1 - k * k) - 1)
      : 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1),
  elasticIn: (k) => {
    let s,
      a = 0.1,
      p = 0.4;
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) (a = 1), (s = p / 4);
    else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    return -(
      a *
      Math.pow(2, 10 * (k -= 1)) *
      Math.sin(((k - s) * (2 * Math.PI)) / p)
    );
  },
  elasticOut: (k) => {
    let s,
      a = 0.1,
      p = 0.4;
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) (a = 1), (s = p / 4);
    else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    return (
      a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1
    );
  },
  elasticInOut: (k) => {
    let s,
      a = 0.1,
      p = 0.4;
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) (a = 1), (s = p / 4);
    else s = (p * Math.asin(1 / a)) / (2 * Math.PI);
    if ((k *= 2) < 1) {
      return (
        -0.5 *
        (a *
          Math.pow(2, 10 * (k -= 1)) *
          Math.sin(((k - s) * (2 * Math.PI)) / p))
      );
    }
    return (
      a *
        Math.pow(2, -10 * (k -= 1)) *
        Math.sin(((k - s) * (2 * Math.PI)) / p) *
        0.5 +
      1
    );
  },
  backIn: (k) => {
    const s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },
  backOut: (k) => {
    const s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },
  backInOut: (k) => {
    const s = 1.70158 * 1.525;
    return (k *= 2) < 1
      ? 0.5 * (k * k * ((s + 1) * k - s))
      : 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
  bounceOut: (k) =>
    k < 1 / 2.75
      ? 7.5626 * k * k
      : k < 2 / 2.75
      ? 7.5625 * (k -= 1.5 / 2.75) * k + 0.75
      : k < 2.5 / 2.75
      ? 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375
      : 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375,
  bounceIn: (k) => 1 - easing.bounceOut(1 - k),
  bounceInOut: (k) =>
    k < 0.5
      ? easing.bounceIn(k * 2) * 0.5
      : easing.bounceOut(k * 2 - 1) * 0.5 + 0.5,
};
