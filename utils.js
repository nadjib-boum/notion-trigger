export function processRecords (records) {
  return records.map ((record) => ({
    id: record.id,
    name: record.properties.Name.title.map((n) => n.plain_text).join(" "),
    phone: record.properties.Phone.phone_number,
    created_time: record.created_time,
    last_edited_time: record.last_edited_time,
  }))
}

export function sleep (t) {
  return new Promise ((resolve) => setTimeout (resolve, t));
}

export function getTodayStart () {

  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  return currentDate.toISOString ();

}