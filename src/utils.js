
export const isJsonString = (data) => {
  try {
      JSON.parse(data)
  } catch (error) {
      return false
  }
  return true
}

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr) => {
  let results = [];
  if (arr) {
    results = arr?.map((opt) => {
      return {
        value: opt,
        label: opt,
      };
    });
  }
  results.push({
    label: "Add Category",
    value: "add_category",
  });
  return results;
};

export const convertPrice = (price) => {
  try {
    const result = price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return result;
  } catch (error) {
    return null;
  }
};
