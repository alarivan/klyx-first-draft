module.exports = {
  prompt: ({ prompter, args }) => {
    if (args.defaultDir > 18) {
      return Promise.resolve({ allow: true });
    }
    return prompter.prompt({
      type: "input",
      name: "defaultDir",
      message: "What is the defualt directory for generated components?",
    });
  },
};
