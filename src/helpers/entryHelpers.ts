import React from 'react';
import moment from "moment";
import { Entry } from "../models/entry";


const transformEntries = (
    items: Entry[],
    date: string,
    slotDuration: moment.Duration,
    onChange: () => void
  ) => {
  let data:  {[key: string]: Entry} = {};

  items.forEach((item) => {
    let time = moment(item.start);
    while (time.isBefore(moment(item.end))) {
      data[time.format("HH:mm")] = {
        title: item.title,
        outcome: item.outcome,
      };
      time = time.clone().add(slotDuration);
    }
  });

  let transformedEntries = [];
  let start = moment(date).startOf("date");

  let time = start.clone();
  for (let i = 0; i < 48; i++) {
    let startKey = time.format("HH:mm");
    let item: Entry = {
      start: startKey,
      end: time.clone().add(slotDuration).format("HH:mm"),
      title: "",
      outcome: "",
      onChange: function (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          field: "title" | "outcome"
      ) {
        this[field] = e.target.value;
        onChange();
      },
    };

    if (!!data[startKey]) {
      item.title = data[startKey].title;
      item.outcome = data[startKey].outcome;
    }
    transformedEntries.push(item);
    time = time.clone().add(slotDuration);
  }

  return transformedEntries;
};

const transformForSave = (entries: Entry[], date: string) => {
  let out: any[] = [];
  entries.forEach((entry) => {
    if (!!entry.title || !!entry.outcome) {
      out.push({
        start: `${date} ${entry.start}`,
        end: `${date} ${entry.end}`,
        title: entry.title,
        outcome: entry.outcome,
      });
    }
  });
  return out;
}


export { transformEntries, transformForSave };
