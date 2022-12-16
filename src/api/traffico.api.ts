import fetch from "node-fetch";
import { IEventsOnStreet, DirectionTo } from "../interfaces/events.models";

export const getEventsOnStreet = async () => {
  const res = await fetch(
    `${process.env.API_URL}/o/map-rest/events-on-street/A4AAA`
  );
  return (await res.json()) as IEventsOnStreet;
};
export const getEvents = async (direction: DirectionTo) => {
  const eventsOnStreet = await getEventsOnStreet();
  return eventsOnStreet.events.filter((event) => event.DIR === direction);
};
export const getTrafficoOvest = async () => getEvents(DirectionTo.MILAN);
export const getTrafficoEst = () => getEvents(DirectionTo.VENEZ);
