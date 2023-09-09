import Color from "color";

type IThemeVars = Array<{ name: string; value: string }>;

export const getTextColor = (color: Color) =>
  color.isLight() ? "#000000" : "#FFFFFF";

const generateActionColors = (
  prefix: string,
  options: {
    base: Color;
    hover: string;
    active: string;
    border?: string;
  },
): IThemeVars => {
  const vars: IThemeVars = [];
  const bg = options.base.hex();
  const text = getTextColor(options.base);
  vars.push({ name: `${prefix}-text`, value: text });
  vars.push({ name: `${prefix}-bg`, value: bg });
  vars.push({ name: `${prefix}-bg-hover`, value: options.hover });
  vars.push({ name: `${prefix}-bg-active`, value: options.active });
  if (options.border) {
    vars.push({ name: `${prefix}-border`, value: options.border });
  }

  return vars;
};

const createThemeColorModifier = (isDark: boolean) => {
  const method = isDark ? "lighten" : "darken";
  return (color: Color, baseValue: number, darkValue?: number) => {
    const value = isDark && darkValue ? darkValue : baseValue;
    return color[method](value);
  };
};

export const generateThemeVars = (baseColor: string): IThemeVars => {
  const color = Color(baseColor);

  const isDark = color.luminosity() < 0.3;
  const adjustColorValue = createThemeColorModifier(isDark);

  const vars: IThemeVars = [];

  const bodyBg = color;
  vars.push({ name: "--body-bg", value: bodyBg.hex() });
  vars.push({ name: "--body-bg", value: bodyBg.hex() });
  vars.push({ name: "--body-text", value: getTextColor(bodyBg) });

  vars.push({
    name: "--body-box-shadow",
    value: adjustColorValue(bodyBg, 0.2).hex(),
  });

  const cardBase = adjustColorValue(bodyBg, 0.5);
  vars.push({ name: "--card-bg", value: cardBase.hex() });
  vars.push({ name: "--card-text", value: getTextColor(cardBase) });

  const timerBase = adjustColorValue(bodyBg, 0.4, 0.8);
  const timerTotal = adjustColorValue(timerBase, -0.2, 0.3);
  vars.push({ name: "--timer-progress-bg", value: timerBase.hex() });
  vars.push({ name: "--timer-progress-text", value: getTextColor(timerBase) });
  vars.push({ name: "--timer-total-bg", value: timerTotal.hex() });
  vars.push({ name: "--timer-total-text", value: getTextColor(timerTotal) });

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

  const actionSecondaryBase = adjustColorValue(cardBase, 0.2, 0.6);
  const actionSecondary = {
    base: actionSecondaryBase,
    hover: adjustColorValue(actionSecondaryBase, 0.1).hex(),
    active: adjustColorValue(actionSecondaryBase, 0.2).hex(),
  };

  const disabledBase = color.grayscale();
  vars.push({ name: "--action-disabled-bg", value: disabledBase.hex() });
  vars.push({
    name: "--action-disabled-text",
    value: getTextColor(disabledBase),
  });

  return vars.concat(
    generateActionColors("--action-fancy", actionFancy),
    generateActionColors("--action-primary", actionPrimary),
    generateActionColors("--action-secondary", actionSecondary),
  );
};

export const applyTheme = (
  root: HTMLElement,
  baseColor: string = "#a6a6a6",
) => {
  generateThemeVars(baseColor).forEach((v) =>
    root.style.setProperty(v.name, v.value),
  );
};
