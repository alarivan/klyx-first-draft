module.exports = {
  helpers: {
    ejsOutput: s => `<%= ${s} %>`,
    // h.componentPathWithFileName('.module.css')
    // output: "src/<%= dir || 'components' %>/<%= name %>/<%= name %>.module.css"
    componentPath: (fileName) => {
      return `"src/<%= dir %>/<%= name %>/${fileName}"`
    }
  }
}
