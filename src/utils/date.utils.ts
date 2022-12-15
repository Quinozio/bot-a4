export const getTime = (date: string) => {
  if (!date) {
    return "-";
  }
  const time = new Date(date).toLocaleTimeString('it-IT');
  const timeSplitted = time.split(":");
  console.log(timeSplitted);
  return timeSplitted[0] + ":" + timeSplitted[1];
};
export const getDate = (date: string) => {
  if (!date) {
    return "-";
  }
  return new Date(date).toLocaleDateString("it-IT");
};
