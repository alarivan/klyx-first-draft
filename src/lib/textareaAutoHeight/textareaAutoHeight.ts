export const textareaAutoHeight = (ref: HTMLTextAreaElement) => {
  setTimeout(() => {
    ref.style.minHeight = "auto";
    ref.style.minHeight = ref.scrollHeight + "px";
  }, 0);

  ref.addEventListener("input", function () {
    ref.style.minHeight = "auto";
    ref.style.minHeight = ref.scrollHeight + "px";
  });
};
