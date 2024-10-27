import { notion, webhook } from "./service.js";
import { sleep, processRecords, getTodayStart } from "./utils.js";

main ();

async function main () {
  await runTrigger ( notion, webhook );
}

async function runTrigger (notion, webhook) {
  const lastItem = await notion.queryLastItem ();

  let lastCheckedTime = lastItem?.last_edited_time || getTodayStart ();

  const INTERVAL = 10;

  while (true) {

    try {

      console.log (`[+] CHECKING_RECORDS_AT:`, lastCheckedTime);

      const records = await notion.queryNewRecords ({ lastCheckedTime });
    
      if (records && records.length > 0) {
        
        const processed_records = processRecords(records);

        for (const record of processed_records) {
          webhook.trigger ({ record });
        }
  
        console.log (`[+] NEW_RECORDS_FOUND:`, records.length);
    
        lastCheckedTime = records[0].last_edited_time;
  
      } else {
  
        console.log (`[X] NOT_RECORDS_FOUND`);
        
      }

    } catch (err) {

      console.log (`[X] ERROR`, err);

    }

    await sleep (INTERVAL * 1000);

  }


}