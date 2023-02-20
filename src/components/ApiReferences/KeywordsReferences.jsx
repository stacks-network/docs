import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CodeBlock from "@theme/CodeBlock";
import MDXContent from "@theme/MDXContent";
import MDXHeading from "@theme/MDXComponents/Heading";

import { nameToId } from "./_helpers";
import { keywords } from "../../_data/clarity-reference.json";

export const KeywordsReferences = ({ toc }) => {
  return keywords.map((keyword) => {
    const id = nameToId(keyword.name, keyword.version);
    // ugly hack to customize table of content from non-markdown content
    // https://github.com/facebook/docusaurus/issues/6201
    if (!toc.find((t) => t.id === id))
      toc.push({ id, level: 3, value: keyword.name });
    return <KeywordReference key={id} {...{ id, keyword }} />;
  });
};

const KeywordReference = ({ id, keyword }) => {
  return (
    <MDXContent>
      <MDXHeading as="h3" id={id}>
        {keyword.name}
      </MDXHeading>

      <p>
        Introduced in: <b>{keyword.version.replace("Clarity", "Clarity ")}</b>
      </p>

      <h4>
        output: <code>{keyword.output_type}</code>
      </h4>

      <h4>description:</h4>
      <ReactMarkdown>{keyword.description}</ReactMarkdown>

      <h4>example:</h4>
      <CodeBlock className="language-clarity">
        {keyword.example.trim()}
      </CodeBlock>
    </MDXContent>
  );
};
