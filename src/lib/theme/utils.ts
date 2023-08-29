import Color from "color";

export const getTextColor = (color: Color) =>
  color.isLight() ? "#000000" : "#FFFFFF";

export const applyColorsToAction = (
  root: HTMLElement,
  prefix: string,
  options: {
    base: Color;
    hover: string;
    active: string;
    border?: string;
  },
) => {
  const bg = options.base.hex();
  const text = getTextColor(options.base);
  root.style.setProperty(`${prefix}-text`, text);
  root.style.setProperty(`${prefix}-bg`, bg);
  root.style.setProperty(`${prefix}-bg-hover`, options.hover);
  root.style.setProperty(`${prefix}-bg-active`, options.active);
  if (options.border) {
    root.style.setProperty(`${prefix}-border`, options.border);
  }
};

const createThemeColorModifier = (isDark: boolean) => {
  const method = isDark ? "lighten" : "darken";
  return (color: Color, baseValue: number, darkValue?: number) => {
    const value = isDark && darkValue ? darkValue : baseValue;
    return color[method](value);
  };
};

export const applyTheme = (
  root: HTMLElement,
  baseColor: string = "#a6a6a6",
) => {
  const color = Color(baseColor);

  const isDark = color.luminosity() < 0.3;
  const adjustColorValue = createThemeColorModifier(isDark);

  const bodyBg = color;
  root.style.setProperty(`--body-bg`, bodyBg.hex());
  root.style.setProperty(`--body-text`, getTextColor(bodyBg));
  root.style.setProperty(
    `--body-box-shadow`,
    adjustColorValue(bodyBg, 0.2).hex(),
  );

  const cardBase = adjustColorValue(bodyBg, 0.5);
  root.style.setProperty(`--card-bg`, cardBase.hex());
  root.style.setProperty(`--card-text`, getTextColor(cardBase));

  const timerBase = adjustColorValue(bodyBg, 0.4, 0.8);
  const timerTotal = adjustColorValue(timerBase, -0.2, 0.3);
  root.style.setProperty(`--timer-progress-bg`, timerBase.hex());
  root.style.setProperty(`--timer-progress-text`, getTextColor(timerBase));
  root.style.setProperty(`--timer-total-bg`, timerTotal.hex());
  root.style.setProperty(`--timer-total-text`, getTextColor(timerTotal));

  const actionFancyBase = adjustColorValue(bodyBg, 0.4, 0.8);
  const actionFancy = {
    base: actionFancyBase,
    hover: adjustColorValue(actionFancyBase, 0.1).hex(),
    active: adjustColorValue(actionFancyBase, 0.2).hex(),
    border: adjustColorValue(actionFancyBase, 0.6).hex(),
  };

  const actionPrimaryBase = adjustColorValue(bodyBg, 0.3, 0.7);
  const actionPrimary = {
    base: actionPrimaryBase,
    hover: adjustColorValue(actionPrimaryBase, 0.2).hex(),
    active: adjustColorValue(actionPrimaryBase, 0.3).hex(),
  };

  const actionSecondaryBase = adjustColorValue(bodyBg, 0.2, 0.6);
  const actionSecondary = {
    base: actionSecondaryBase,
    hover: adjustColorValue(actionSecondaryBase, 0.1).hex(),
    active: adjustColorValue(actionSecondaryBase, 0.2).hex(),
  };

  applyColorsToAction(root, "--action-fancy", actionFancy);
  applyColorsToAction(root, "--action-primary", actionPrimary);
  applyColorsToAction(root, "--action-secondary", actionSecondary);

  const disabledBase = color.grayscale();
  root.style.setProperty(`--action-disabled-bg`, disabledBase.hex());
  root.style.setProperty(`--action-disabled-text`, getTextColor(disabledBase));
};
