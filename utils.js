import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_PAGE_ID;

export const findDatabaseItemByID = async (id) => {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'ID',
            title: {
              equals: id,
            },
          },
        ],
      },
    });
    if (response.results.length === 0) {
      return null;
    }
    return response.results[0];
  };

export const findDatabaseItemByEmail = async (email) => {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Email',
            email: {
              equals: email,
            },
          },
        ],
      },
    });
    if (response.results.length === 0) {
      return null;
    }
    return response.results[0];
  };

export const generateProperties = (data) => {
/*
  ID: {
          title: [
            {
              text: {
                content: String(item.id),
              },
            },
          ],
        },
        Completion: {
          number: item.progress_percentage,
        },
        Course:{
          select:{
            name: item.course_name,
          }

        },
        Email: {
          email: item.user_email,
        },
      */

  return {
    ID: {
      title: [
        {
          text: {
            content: String(data.id),
          },
        },
      ],
    },
    Completion: {
      number: data.progress_percentage,
    },
    Course:{
      select:{
        name: data.course_name,
      }
    },
    Email: {
      email: data.user_email,
    },
  };
  }
