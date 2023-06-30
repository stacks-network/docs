import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CodeBlock from "@theme/CodeBlock";
import MDXContent from "@theme/MDXContent";
import MDXHeading from "@theme/MDXComponents/Heading";

import { nameToId } from "./_helpers";
import { functions } from "../../_data/clarity-reference.json";

export const FunctionsReferences = ({ toc }) => {
  return functions.sort().map((func) => {
    const id = nameToId(func.name, func.version);
    // ugly hack to customize table of content from non-markdown content
    // https://github.com/facebook/docusaurus/issues/6201
    const value = func.name.replace(">", "&gt;").replace("<", "&lt;");
    if (!toc.find((t) => t.id === id)) toc.push({ id, level: 3, value });
    return <FunctionReference key={id} {...{ id, func }} />;
  });
};

const FunctionReference = ({ id, func }) => {
  return (
    <MDXContent>
      <MDXHeading as="h3" id={id}>
        {func.name}
      </MDXHeading>

      <p>
        Introduced in: <b>{func.version.replace("Clarity", "Clarity ")}</b>
      </p>

      <p>
        <b>input:</b> <code>{func.input_type}</code>
      </p>

      <p>
        <b>output:</b> <code>{func.output_type}</code>
      </p>

      <p>
        <b>signature:</b> <code>{func.signature}</code>
      </p>

      <p><b>description:</b></p>
      <ReactMarkdown>{func.description}</ReactMarkdown>

      <p><b>example:</b></p>
      <CodeBlock className="language-clarity">{func.example.trim()}</CodeBlock>
    </MDXContent>
  );
};
