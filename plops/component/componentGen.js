module.exports = {
  description:
    "Creates React Native component and style files inside /components",
  prompts: [
    {
      type: "list",
      name: "type",
      message: "What is your React Native Component type?",
      choices: ["atom", "molecule", "organism", "layout", "graph"],
    },
    {
      type: "input",
      name: "name",
      message: "What is your React Component name?",
    },
    {
      type: "list",
      name: "complexity",
      message: "What is the complexity of your React Component?",
      choices: ["dumb", "smart", "connected"],
    },
  ],
  actions: [
    {
      type: "add",
      path:
        "app/components/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.js",
      templateFile: "plops/component/{{complexity}}.js.txt",
    },
    {
      type: "add",
      path:
        "app/components/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.styles.js",
      templateFile: "plops/component/component.styles.js.txt",
    },

    // stories file setup
    {
      type: "add",
      path:
        "app/components/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.stories.js",
      templateFile: "plops/storybook/component.stories.js.txt",
    },
    {
      type: "modify",
      path: "app/components/{{type}}s/{{pascalCase type}}s.stories.js",
      pattern: "// NOTE(fj): plop componentGen importing new stories here",
      template: [
        'import {{pascalCase name}}Stories from "./{{pascalCase name}}/{{pascalCase name}}.stories"',
        "// NOTE(fj): plop componentGen importing new stories here",
      ].join("\n"),
    },
    {
      type: "modify",
      path: "app/components/{{type}}s/{{pascalCase type}}s.stories.js",
      pattern: "  // NOTE(fj): plop componentGen adding new stories here",
      template: [
        '  .add("{{pascalCase name}}", {{pascalCase name}}Stories)',
        "  // NOTE(fj): plop componentGen adding new stories here",
      ].join("\n"),
    },
  ],
};
