import supabase from './supabase.js';
import notion from './notion.js';
import { findDatabaseItemByID,generateProperties } from './utils.js';

const pageID = process.env.NOTION_PAGE_ID;

const initialLoad = async () => {

  const { data, error } = await supabase.from('user_progress').select('*');
  if (error) {
    console.log('Error: ', error);
  }
  for (const item of data) {
    // For each item, check if it exists in the Notion database
    // If it does, update it
    // If it doesn't, insert it
    const currentItem = await findDatabaseItemByID(String(item.id));
    if (currentItem) {
      console.log('Updating item: ', item.id);
      await notion.pages.update({
        page_id: currentItem.id,
        properties: generateProperties(item),
      });
      continue;
    }

    console.log('Inserting item: ', item.id);
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
        try{
          const eventType = payload.eventType;
          await handleEvent(payload,eventType);
        }catch(e){
          console.log('Error: ', e);
        }
      }
    )
    .subscribe();
};

initialLoad();
main();
