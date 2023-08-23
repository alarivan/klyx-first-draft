import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { useForm } from "./useForm";

describe("useForm", () => {
  describe("initForm", () => {
    it("should run accessor when form is submitted", () => {
      createRoot((dispose) => {
        const { initForm } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const formElement = document.createElement("form");
        const accessor = vi.fn();

        initForm(formElement, () => accessor);

        formElement.onsubmit?.({
          preventDefault: vi.fn(),
        } as unknown as SubmitEvent);

        expect(accessor).toHaveBeenCalledOnce();

        dispose();
      });
    });

    it("should validate form inputs when form is submitted", () => {
      createRoot((dispose) => {
        const { initForm, initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const formElement = document.createElement("form");
        const inputElement = document.createElement("input");
        inputElement.name = "name";
        formElement.appendChild(inputElement);

        const accessor = vi.fn();
        const validator = vi.fn().mockReturnValue("error");

        initForm(formElement, () => accessor);
        initFormInput(inputElement, () => [validator]);

        formElement.onsubmit?.({
          preventDefault: vi.fn(),
        } as unknown as SubmitEvent);

        expect(accessor).not.toHaveBeenCalled();
        expect(validator).toHaveBeenCalledOnce();

        dispose();
      });
    });

    it("should validate form inputs when form input is re-added to the form", () => {
      createRoot((dispose) => {
        const { initForm, initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const formElement = document.createElement("form");
        const inputElement = document.createElement("input");
        inputElement.name = "name";
        formElement.appendChild(inputElement);

        const accessor = vi.fn();
        const validator = vi.fn().mockReturnValue("error");

        initForm(formElement, () => accessor);
        initFormInput(inputElement, () => [validator]);
        initFormInput(inputElement, () => [validator]);

        formElement.onsubmit?.({
          preventDefault: vi.fn(),
        } as unknown as SubmitEvent);

        expect(accessor).not.toHaveBeenCalled();
        expect(validator).toHaveBeenCalledOnce();

        dispose();
      });
    });

    it("should validate form input is initialized before form", () => {
      createRoot((dispose) => {
        const { initForm, initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const formElement = document.createElement("form");
        const inputElement = document.createElement("input");
        inputElement.name = "name";
        formElement.appendChild(inputElement);

        const accessor = vi.fn();
        const validator = vi.fn().mockReturnValue("error");

        initFormInput(inputElement, () => [validator]);
        initForm(formElement, () => accessor);
        initFormInput(inputElement, () => [validator]);

        formElement.onsubmit?.({
          preventDefault: vi.fn(),
        } as unknown as SubmitEvent);

        expect(accessor).not.toHaveBeenCalled();
        expect(validator).toHaveBeenCalledOnce();

        dispose();
      });
    });
  });

  describe("initFormInput", () => {
    it("should set errors and add class on blur and remove both on input", () => {
      createRoot(async (dispose) => {
        const { initFormInput, errors } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        const validator = vi.fn().mockReturnValue("error");

        initFormInput(inputElement, () => [validator]);

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
        const { initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        const validator = vi.fn().mockReturnValue("error");

        initFormInput(inputElement, () => [validator]);

        await inputElement.oninput?.(vi.fn() as unknown as Event);

        expect(inputElement.className).toEqual("");

        dispose();
      });
    });

    it("should run with validator as boolean", () => {
      createRoot(async (dispose) => {
        const { initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";

        initFormInput(inputElement, () => true);

        await inputElement.onblur?.(vi.fn() as unknown as FocusEvent);

        expect(inputElement.className).toEqual("");

        dispose();
      });
    });

    it("should run when there is no errors returend by validators", () => {
      createRoot(async (dispose) => {
        const { initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        const validator = vi.fn().mockReturnValue(undefined);

        initFormInput(inputElement, () => [validator]);

        await inputElement.onblur?.(vi.fn() as unknown as FocusEvent);

        expect(inputElement.className).toEqual("");

        dispose();
      });
    });
  });

  describe("values", () => {
    it("should return values", () => {
      createRoot(async (dispose) => {
        const { values, initFormInput } = useForm({
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        inputElement.value = "val";
        const validator = vi.fn().mockReturnValue(undefined);

        initFormInput(inputElement, () => [validator]);

        await inputElement.onblur?.(vi.fn() as unknown as FocusEvent);

        expect(values()).toEqual({ name: "val" });

        dispose();
      });
    });

    it("should return values with checkbox input", () => {
      createRoot(async (dispose) => {
        const { values, initFormInput } = useForm({
          fieldNames: ["toggle"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "toggle";
        inputElement.type = "checkbox";
        inputElement.checked = true;
        const validator = vi.fn().mockReturnValue(undefined);

        initFormInput(inputElement, () => [validator]);

        await inputElement.oninput?.(vi.fn() as unknown as Event);
        await inputElement.onblur?.(vi.fn() as unknown as FocusEvent);

        expect(values()).toEqual({ toggle: true });

        dispose();
      });
    });
  });

  describe("initialValues", () => {
    it("should init input with initial values", () => {
      createRoot(async (dispose) => {
        const { values, initFormInput } = useForm({
          initialValues: { name: "initial" },
          fieldNames: ["name"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "name";
        inputElement.value = "val";

        initFormInput(inputElement, () => []);

        expect(values()).toEqual({ name: "initial" });

        dispose();
      });
    });

    it("should set initial value for checkbox", () => {
      createRoot(async (dispose) => {
        const { values, initFormInput } = useForm({
          initialValues: { toggle: true },
          fieldNames: ["toggle"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "toggle";
        inputElement.checked = false;
        inputElement.type = "checkbox";

        initFormInput(inputElement, () => []);

        expect(values()).toEqual({ toggle: true });

        dispose();
      });
    });

    it("should set initial value for checkbox when false", () => {
      createRoot(async (dispose) => {
        const { values, initFormInput } = useForm({
          initialValues: { toggle: false },
          fieldNames: ["toggle"],
          errorClass: "err",
        });

        const inputElement = document.createElement("input");
        inputElement.name = "toggle";
        inputElement.checked = false;
        inputElement.type = "checkbox";

        initFormInput(inputElement, () => []);

        expect(values()).toEqual({ toggle: false });

        dispose();
      });
    });
  });
});
