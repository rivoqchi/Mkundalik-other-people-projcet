export const extractInnerPath = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  parts.shift(); // birinchi role qismini olib tashlaymiz
  return parts.join("/");
};