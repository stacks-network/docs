import React, { useEffect } from "react";

import { webVitals } from "@site/src/components/HomepageFeatures/reportWebVitals";

//Added to redirect the main page to the docs
import { Redirect } from "@docusaurus/router";

export default function Home() {
  useEffect(() => {
    webVitals();
  }, []);

  return <Redirect to="/docs/intro" />;
}
