export const isImageLink = (url = "") => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const extension = url?.split(".")?.pop()?.toLowerCase() ?? "";

  return imageExtensions.includes(extension);
};
