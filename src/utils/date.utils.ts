export const getTime = (date: string) => {
  const time = new Date(date).toLocaleTimeString();
  const timeSplitted = time.split(":");
  console.log(timeSplitted);
  return timeSplitted[0] + ":" + timeSplitted[1];
};
export const getDate = (date: string) => {
  return new Date(date).toLocaleDateString("it-IT");
};
