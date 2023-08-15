---
to: _templates/component/<%= name %>/index.js
---
module.exports = {
  params: ({ args }) => {
    return { dir: args.dir || "<%= defaultDir %>" };
  },
};
