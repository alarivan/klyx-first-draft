import { formatSecondsToTime } from ".";

describe(formatSecondsToTime, () => {
  it("returns time for < minute", () => {
    expect(formatSecondsToTime(10)).toEqual("00:10");
  });

  it("returns time for > minute", () => {
    expect(formatSecondsToTime(60)).toEqual("01:00");
  });
});
