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

export const applyTheme = (
  root: HTMLElement,
  baseColor: string = "#a6a6a6",
) => {
  const color = Color(baseColor);
  root.style.setProperty(`--base-color`, color.hex());

  const bodyBg = color.lighten(0.8);
  root.style.setProperty(`--body-bg`, bodyBg.hex());
  root.style.setProperty(`--body-text`, getTextColor(bodyBg));
  root.style.setProperty(`--body-box-shadow`, bodyBg.darken(0.2).hex());

  const cardBase = color.lighten(0.4);
  root.style.setProperty(`--card-bg`, cardBase.hex());
  root.style.setProperty(`--card-text`, getTextColor(cardBase));

  const timerBase = color.darken(0.2);
  root.style.setProperty(`--timer-progress-bg`, timerBase.hex());
  root.style.setProperty(`--timer-progress-text`, getTextColor(timerBase));
  root.style.setProperty(`--timer-total-bg`, timerBase.lighten(0.3).hex());
  root.style.setProperty(
    `--timer-total-text`,
    getTextColor(timerBase.lighten(0.3)),
  );

  const actionFancyBase = color.darken(0.4);
  const actionFancy = {
    base: actionFancyBase,
    hover: actionFancyBase.darken(0.1).hex(),
    active: actionFancyBase.lighten(0.1).hex(),
    border: actionFancyBase.darken(0.6).hex(),
  };

  const actionPrimaryBase = color.darken(0.3);
  const actionPrimary = {
    base: actionPrimaryBase,
    hover: actionPrimaryBase.lighten(0.2).hex(),
    active: actionPrimaryBase.lighten(0.1).hex(),
  };

  const actionSecondaryBase = color.lighten(0.2);
  const actionSecondary = {
    base: actionSecondaryBase,
    hover: actionSecondaryBase.darken(0.2).hex(),
    active: actionSecondaryBase.darken(0.1).hex(),
  };

  applyColorsToAction(root, "--action-fancy", actionFancy);
  applyColorsToAction(root, "--action-primary", actionPrimary);
  applyColorsToAction(root, "--action-secondary", actionSecondary);

  const disabledBase = Color("#a5a5a5");
  root.style.setProperty(`--action-disabled-bg`, disabledBase.hex());
  root.style.setProperty(`--action-disabled-text`, getTextColor(disabledBase));
};
