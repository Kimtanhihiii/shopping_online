const normalizeImageSrc = (image) => {
  if (!image) {
    return '';
  }

  const trimmed = image.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('data:image')) {
    return trimmed;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  return `data:image/jpeg;base64,${trimmed}`;
};

export default normalizeImageSrc;
