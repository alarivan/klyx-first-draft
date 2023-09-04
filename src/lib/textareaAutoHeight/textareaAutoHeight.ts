export const textareaAutoHeight = (ref: HTMLTextAreaElement) => {
  ref.addEventListener("input", function () {
    this.style.minHeight = "auto";
    this.style.minHeight = ref.scrollHeight + "px";
  });
};
