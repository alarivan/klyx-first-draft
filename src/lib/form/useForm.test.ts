import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { useForm } from "./useForm";

describe("useForm", () => {
  describe("formSubmit", () => {
    it("should run accessor when there is no inputs to validate", () => {
      createRoot((dispose) => {
        const { formSubmit } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const formElement = {
          setAttribute: vi.fn(),
        } as unknown as HTMLFormElement;
        const accessor = vi.fn();

        formSubmit(formElement, () => accessor);

        formElement.onsubmit?.({
          preventDefault: vi.fn(),
        } as unknown as SubmitEvent);

        expect(accessor).toHaveBeenCalledOnce();

        dispose();
      });
    });

    it("should run accessor when with inputs to validate", () => {
      createRoot((dispose) => {
        const { formSubmit, validate } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const formElement = {
          setAttribute: vi.fn(),
        } as unknown as HTMLFormElement;
        const inputElement = document.createElement("input");
        inputElement.name = "name";
        const accessor = vi.fn();
        const validator = vi.fn().mockResolvedValue("error");

        validate(inputElement, () => [validator]);
        formSubmit(formElement, () => accessor);

        formElement.onsubmit?.({
          preventDefault: vi.fn(),
        } as unknown as SubmitEvent);

        expect(accessor).not.toHaveBeenCalled();
        expect(validator).toHaveBeenCalledOnce();

        dispose();
      });
    });
  });

  describe("validate", () => {
    it("should set errors and add class on blur and remove both on input", () => {
      createRoot(async (dispose) => {
        const { validate, errors } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        const validator = vi.fn().mockResolvedValue("error");

        validate(inputElement, () => [validator]);

        await inputElement.onblur?.(vi.fn() as unknown as FocusEvent);
        expect(validator).toHaveBeenCalledOnce();
        expect(errors).toEqual({ name: "error" });
        expect(inputElement.className).toEqual("err");

        await inputElement.oninput?.(vi.fn() as unknown as Event);

        expect(errors).toEqual({ name: undefined });
        expect(inputElement.className).toEqual("");

        dispose();
      });
    });

    it("should run oninput when errors there is no errors", () => {
      createRoot(async (dispose) => {
        const { validate } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        const validator = vi.fn().mockResolvedValue("error");

        validate(inputElement, () => [validator]);

        await inputElement.oninput?.(vi.fn() as unknown as Event);

        expect(inputElement.className).toEqual("");

        dispose();
      });
    });

    it("should run with validator as boolean", () => {
      createRoot(async (dispose) => {
        const { validate } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";

        validate(inputElement, () => true);

        await inputElement.oninput?.(vi.fn() as unknown as Event);

        expect(inputElement.className).toEqual("");

        dispose();
      });
    });
  });
});
