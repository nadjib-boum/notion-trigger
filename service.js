import { Client } from "@notionhq/client";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { getTodayStart } from "./utils.js";

dotenv.config ();

class NotionService {

  constructor ({
    database_id
  }) {
    this.client = new Client({ auth: process.env.NOTION_API_KEY });
    this.database_id = database_id;
  }

  async queryNewRecords ({ lastCheckedTime }) {

    const response = await this.client.databases.query ({
      database_id: this.database_id,
      filter: {
        and: [
          {
            property: "Status",
            status: {
              equals: "Done",
            }
          },
          {
            timestamp: "last_edited_time",
            last_edited_time: {
              after: lastCheckedTime
            }
          },
        ]
      },
      sorts: [
        {
          timestamp: "last_edited_time",
          direction: "descending"
        }
      ]
    });

    return response.results;

  }

  async queryLastItem () {

    const today = getTodayStart ();

    const records = await this.queryNewRecords ({
      lastCheckedTime: today
    });

    return records[0];

  }

  async getDB () {

    const db = await this.client.databases.query ({
      database_id: this.database_id
    });

    return db.results;

  }

}

class WebhookService {

  constructor ({ url }) {

    this.url = url;

  }

  async trigger (data) {

    await fetch (this.url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });

  }

}

export const notion = new NotionService ({
  database_id: process.env.NOTION_DATABASE_ID
});

export const webhook = new WebhookService ({
  url: process.env.WEBHOOK_URL
});
