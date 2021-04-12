/* eslint-env jest */
import deflist from "./index";
import html from "rehype-stringify";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import unified from "unified";
import mdx from "@mdx-js/mdx";
import mdxUtil from "mdast-util-mdx";
import syntax from "micromark-extension-mdxjs";
import remarkSuperSub from "../../remark-supersub/src";

const strip = ([str]) => {
  const stripped = str.replace(/\n {6}/g, "\n").replace(/\n {4}$/, "");
  console.log(stripped);
  return stripped;
};

const parse = (str) =>
  unified()
    .use(markdown)
    .use(deflist)
    .use(remark2rehype)
    .use(html)
    .process(str, function (err, file) {
      if (err) throw err;
      console.log(String(file));
    })
    .then((data) => data.toString());

const mdxParse = (str) =>
  mdx(str, {
    remarkPlugins: [
      [
        deflist,
        {
          fromMarkdownOptions: {
            extensions: [syntax()],
            mdastExtensions: [mdxUtil.fromMarkdown],
          },
          toMarkdownOptions: { extensions: [mdxUtil.toMarkdown] },
        },
      ],
      remarkSuperSub,
    ],
  }).then((data) => data.toString());

const tests = [
  [
    "basic definition list",
    strip`
      Term 1

      : Definition 1
    `,
  ],
  [
    "definition list with inline markup",
    strip`
      Term *1*

      : Definition **1**
    `,
  ],
  [
    "document with other elements",
    strip`
      Definition List

      : Definition 1

      This paragraph follows the definition list.
    `,
  ],
  [
    "definition list with continuation",
    strip`
      Term 1

      : Definition
        with continuation.
    `,
  ],
  [
    "definition list with lazy continuation",
    strip`
      Term 1

      : Definition
      with lazy continuation.
    `,
  ],
  [
    "definition list with no space between the term and the descriptions (#7)",
    strip`
      Term **1**
      : Definition **bold** 1
      : Definition 2
    `,
  ],
  [
    "definition list with multiple descriptions (#9)",
    strip`
      Multiple descriptions

      : Description **1**
      : Description 2
    `,
  ],
  [
    "document with several subsequent definition lists (#10)",
    strip`
      Definition List 1

      : Description 1

      Definition List 2

      : Description 1

      Definition List 3

      : Description 1
    `,
  ],
];

const mdxTests = [
  ...tests,
  [
    "definition list with jsx",
    strip`
      Definition List 1

      : Definition <b>{2 + 5}</b>
    `,
  ],
  [
    "definition list with another remark plugin's syntax",
    strip`
      Definition List 1

      : Definition^1^, H~2~0
    `,
  ],
];

describe("remark-deflist", () => {
  describe.skip.each(tests)("with a standard parser", (name, source) => {
    it(`should parse a ${name}`, () => {
      return expect(parse(source)).resolves.toMatchSnapshot();
    });
  });

  describe.each(mdxTests)("with an mdx parser", (name, source) => {
    it(`should parse a ${name}`, () => {
      return expect(mdxParse(source)).resolves.toMatchSnapshot();
    });
  });
});
