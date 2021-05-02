const isValidColor = (color) => {
  const isValid3 = /^#[0-9a-fA-F]{3}$/.test(color);
  const isValid6 = /^#[0-9a-fA-F]{6}$/.test(color);
  return isValid3 || isValid6;
};

const isValidCode = (string) => {
  return /^[0-9]{6}$/.test(string);
};

const isValidEmail = (string) => {
  return /^[a-zA-Z0-9_.-]{1,}@[a-zA-Z0-9_-]{2,}(.[a-zA-Z0-9_-]{2,}){1,}$/.test(string);
};

const isValidPhone = (string) => {
  return /^[0-9]{10}$/.test(string);
};

export const validator = {
  isValidColor,
  isValidCode,
  isValidEmail,
  isValidPhone,
};
