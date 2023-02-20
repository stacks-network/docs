const idPattern = /[^A-Za-z0-9\-]/g;
export const nameToId = (name, version) => {
  let slug = name.trim().replaceAll(" ", "-").replace(idPattern, "");
  let suffix = version === "Clarity1" ? "" : `-${version}`.toLowerCase();
  return `${slug}${suffix}`;
};
