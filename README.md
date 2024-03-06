## 1) Create a Notion Page
![image](https://github.com/brandonetter/supabase_notion_integration/assets/4108484/efde4327-7f01-4630-a323-f8bbf49a2379)

## 2) Add A Full-Page Database
![image](https://github.com/brandonetter/supabase_notion_integration/assets/4108484/78d2d95c-aa69-41f2-917b-91a0a31cbaa0)

## 3) First Param is `NOTION_PAGE_ID`, we'll need for the .env
![image](https://github.com/brandonetter/supabase_notion_integration/assets/4108484/b335739c-e291-4597-8bb7-1dc065587f67)
in this picture the page_id is: `2e6d90eff4cb455197d2977de685a6ff`

## 4) Setup Notion DB to accept our Data:

![image](https://github.com/brandonetter/supabase_notion_integration/assets/4108484/18d0b4c6-3efc-45d6-b916-db251aaccef2)
```
ID: Title
Course: Select (not multi-select)
Email: Email
Completion: Number
```

## 5) Setup a Notion Integration:
https://www.notion.so/my-integrations
Associate the Correct Workspace and give it a name:
![image](https://github.com/brandonetter/supabase_notion_integration/assets/4108484/16e27049-7f21-4996-bc12-25d9a3150301)

Copy the secret and save it for our `NOTION_KEY` .env

## 6) Connect our Integration to the page
https://github.com/brandonetter/supabase_notion_integration/assets/4108484/25978282-399f-4a05-afab-54702d1418b5


## 7) Fill out our .env
```
NOTION_KEY=
NOTION_PAGE_ID=
DB_URL=
DB_KEY=
```
DB_KEY will need to be the service_key, not anon_key

## 8) Run the App and Watch it initialize / track updates :)
https://github.com/brandonetter/supabase_notion_integration/assets/4108484/acf4d673-8e43-4653-a7de-95364944461b



## 0) Steps already handled but noted for posterity:
Enable real-time
![image](https://github.com/brandonetter/supabase_notion_integration/assets/4108484/bcc97b77-bc3d-4ebf-92c0-420f86137973)
Create real-time publication in the database:
```sql
begin;

-- remove the supabase_realtime publication
drop
  publication if exists progress_feed;

-- re-create the supabase_realtime publication with no tables
create publication progress_feed;

commit;

-- add a table called 'messages' to the publication
-- (update this to match your tables)
alter
  publication progress_feed add table user_progress;
```




