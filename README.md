# _Comments_

#### _Simple interface for viewing, creating, editing, and deleting comments._

## Technologies Used
* _Node.js_
* _Express_
* _Morgan_
* _MongoDB_
* _Mongoose_

## Description
Simple interface for viewing, creating, editing, and deleting comments. Made to test the connection between front-ends and back-ends.

## MVP
* GET comment, POST comment, PUT (edit/update) comment, and DELETE comment.

## Nice to haves
* Reply feature
* User accounts to associate comments with Users and to disallow others from editing/deleting your comments.  
* @User mention system

## Summary
1. Comments
    1. 2 types of Comments can be created -- Parent and Children
        1. Parent Comments: top-level Comments that can be replied to
        1. Children Comments: replies to parent Comments
    1. Only Parents can be replied to
    1. IDs are associated to both types of Comments
    1. Parents link to Children IDs
    1. Children link to Parent IDs
    1. Comments link to User IDs
1. Users 
    1. 2 types of Users exist -- Account or Anonymous
        1. Account: Permanent ID
        2. Anonymous: Temporary ID for session

## Comment Router  
| Endpoint | Method | Accept | Response |
| ---------|--------|--------|----------|
| /comments |	GET | html | GET comments view
| /comments | GET | json | GET 1st n comments
| /comments | POST | json | POST comment
| /comments/:id | GET | html | GET comment view
| /comments/:id | GET | json | GET comment
| /comments/:id | POST | json | POST reply to comment
| /comments/:id | PUT | json | PUT comment
| /comments/:id | DELETE | json | DELETE comment

## NoSQL data structure

### Store and structure comments in the database
Create collection or table for comments, and link them using a foreign key or a reference field. Alternatively, use a nested document structure, where each parent comment contains an array of children comments as subdocuments. May also need to add fields for the author, the content, the timestamp, the likes, and the replies of each parent comment and children comment.

### Store and identify users and anonymous users
Create separate collection or table for user profiles and assign a unique ID or username to each user. For anonymous users, generate a random or temporary ID or username that is created when they start a session, and expires after a certain period of time or after they close their session.

### @ mention feature in the app
Use a regular expression or parser to detect and extract the @ mentions from the comment content, and then use a query or join to fetch the corresponding user profile from the database. Also send a notification or an email to the mentioned user, if they have enabled that option in their settings.

## Schema
```js
{
  parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  deleted: { type: Boolean },
},
{ timestamps: true }
```

## Sample Comment Documents
```json 
[
  // Parent comment has null for the parent field
  {
    "_id": ObjectId("60d9f7c9a9f1f3b5f8c8a0c3"),
    "parent": null,
    "author": ObjectId("198cnjkdshasdhc239h7hrfs"),
    "text": "I want to create a simple comment system where each comment can be a reply to another comment, and each comment can have multiple replies. How would you link them together in a NoSQL database?",
  },
  // Reply 1
  {
    "_id": ObjectId("60d9f7c9a9f1f3b5f8c8a0c4"),
    "parent": ObjectId("60d9f7c9a9f1f3b5f8c8a0c3"),
    "author": ObjectId("5ger6s51es6v4er8es3dfv51"),
    "text": "You can use a nested document structure, where each comment is a subdocument of its parent comment, and each comment has a field that indicates its level of nesting.",
  },
  // Reply 2
  {
    "_id": ObjectId("60d9f7c9a9f1f3b5f8c8a0c5"),
    "parent": ObjectId("60d9f7c9a9f1f3b5f8c8a0c3"),
    "author": ObjectId("1we5fwa5f4savs8af9d8a1sd"),
    "text": "I agree with Bob, this is a good way to link the comments together. @Alice, what do you think?",
    "deleted": true
  },
  // Reply 3
  {
    "_id": ObjectId("60d9f7c9a9f1f3b5f8c8a0c6"),
    "parent": ObjectId("60d9f7c9a9f1f3b5f8c8a0c3"),
    "author": ObjectId("5ger6s51es6v4er8es3dfv51"),
    "text": "You can also use a flat document structure, where each comment is a separate document, and each comment has a field that references its parent comment's ID.",
  },
  // Reply 4
  {
    "_id": ObjectId("60d9f7c9a9f1f3b5f8c8a0c7"),
    "parent": ObjectId("60d9f7c9a9f1f3b5f8c8a0c3"),
    "author": ObjectId("198cnjkdshasdhc239h7hrfs"),
    "text": "Thanks for your replies, everyone. I think I prefer the flat document structure, as it seems more flexible and scalable. @Bob, do you have any examples of how to query and update the comments using this method?",
  }
]
```
