module.exports = {
  params: ({ args }) => {
    return { dir: args.dir || "pages" };
  },
};
