import supabase from './supabase.js';
import notion from './notion.js';
import { findDatabaseItemByID,generateProperties } from './utils.js';

const pageID = process.env.NOTION_PAGE_ID;

const initialLoad = async () => {
  // on initial load, delete all items in the Notion database
  // and then fetch all data from Supabase and insert into Notion
  // this is to ensure that the Notion database is in sync with the Supabase database
  // when the server starts
  const currentItems = await notion.databases.query({
    database_id: pageID,
  });
  for (const item of currentItems.results) {
    await notion.pages.update({
      page_id: item.id,
      archived: true,
    });
  }

  // Fetch data from Supabase
  const { data, error } = await supabase.from('user_progress').select('*');
  if (error) {
    console.log('Error: ', error);
  }
  for (const item of data) {
    await notion.pages.create({
      parent: { database_id: pageID },
      properties: generateProperties(item),
    });
  }
}

const handleEvent = async (payload,eventType) => {
  switch (eventType) {
    case 'DELETE': {
      const data = payload.old;
      const currentItem = await findDatabaseItemByID(String(data.id));
      if (currentItem) {
        await notion.pages.update({
          page_id: currentItem.id,
          archived: true,
        });
      }
      break;
    }
    case 'INSERT': {
      const data = payload.new;
        await notion.pages.create({
          parent: { database_id: pageID },
          properties: generateProperties(data),
        });
        break;
      }
    case 'UPDATE': {
      const data = payload.new;
      const currentItem = await findDatabaseItemByID(String(data.id));
      await notion.pages.update({
        page_id: currentItem.id,
        properties: generateProperties(data),
      });
      break;
    }
    default: {
      console.log('Error: Event type not recognized');
    }
  }
}

const main = async () => {
  supabase
    .channel('progress_feed')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
      },
      async (payload) => {
        const eventType = payload.eventType;
        await handleEvent(payload,eventType);
      }
    )
    .subscribe();
};

initialLoad();
main();
