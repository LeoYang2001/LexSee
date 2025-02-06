export const convertTimestampToDateFormat = (timestamp) => {
  const date = new Date(timestamp);

  // Get the year, month, and date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  // Format as "YYYY/MM/DD"
  return `${year}/${month}/${day}`;
};
