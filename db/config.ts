import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    _id: column.text({ primaryKey: true }),
    username: column.text(),
    email: column.text(),
    isVerified: column.boolean({ default: false }),
    password: column.text(),
    emailToken: column.text({ optional: true })
  }
});

const Comment = defineTable({
  columns: {
    _id: column.text({ primaryKey: true }),
    author: column.text({ references: () => User.columns._id }),
    artRef: column.text(),
    date: column.date(),
    body: column.text()
  }
});

const ArtCommission = defineTable({
  columns: {
    _id: column.text({ primaryKey: true }),
    title: column.text(),
    description: column.text(),
    platform: column.text(),
    contact: column.text(),
    size: column.text(),
    references: column.text(),
    payment: column.text()
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: { Comment, User, ArtCommission }
});
