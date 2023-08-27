import { WakeLockSentinel } from "jest-wake-lock-mock/src/WakeLock";
import { createRoot } from "solid-js";

import { createWakeLock } from "./createWakeLock";

describe("createWakeLock", () => {
  describe("when wakeLock api is available", () => {
    const mockRequest = vi.fn();
    beforeAll(() => {
      Object.defineProperty(navigator, "wakeLock", {
        value: {
          request: mockRequest,
        },
      });
    });

    beforeEach(() => {
      mockRequest.mockImplementation((type) => new WakeLockSentinel(type));
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("returns initial state", () => {
      createRoot((dispose) => {
        const [isActive, isAvailable] = createWakeLock();
        expect(isActive()).toEqual(false);
        expect(isAvailable).toEqual(true);

        dispose();
      });
    });

    it("requests wake lock", async () => {
      createRoot(async (dispose) => {
        const [isActive, _, request] = createWakeLock();
        expect(isActive()).toEqual(false);

        request();

        await new Promise((done) => setTimeout(done, 0));

        expect(isActive()).toEqual(true);
        dispose();
      });
    });

    it("doesn't change active when wake lock throws error", () => {
      mockRequest.mockRejectedValue("error");

      vi.spyOn(global, "alert").mockImplementation(() => {});

      createRoot(async (dispose) => {
        const [isActive, _, request] = createWakeLock();
        expect(isActive()).toEqual(false);

        request();
        await new Promise((done) => setTimeout(done, 0));

        expect(isActive()).toEqual(false);
        dispose();
      });
    });

    it("releases wakeLock", () => {
      createRoot(async (dispose) => {
        const [isActive, _, request, release] = createWakeLock();
        expect(isActive()).toEqual(false);

        request();
        await new Promise((done) => setTimeout(done, 0));
        expect(isActive()).toEqual(true);

        release();
        await new Promise((done) => setTimeout(done, 0));
        expect(isActive()).toEqual(false);

        dispose();
      });
    });
  });
});
