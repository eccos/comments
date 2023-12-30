# _Comments_

#### _Simple interface for viewing, creating, editing, and deleting comments._

## Technologies Used
* _Node.js_
* _Express_
* _Morgan_

## Description
App to test the connection between the front-end and back-end. Provides a simple interface for viewing, creating, editing, and deleting comments.  
#### MVP:  
GET comment, POST comment, PUT (edit/update) comment, and DELETE comment.  
#### Nice to haves:  
User accounts to associate comments with Users and to disallow others from editing/deleting your comments.  
Reply feature. (Need figure out how to handle interconnected comments. Probably will be a mess of Ids.)

### Comment Router  
Endpoints | HTTP Method(s) | View
----------|----------------|------------
/comment | GET, POST | GET: Blank page with input box to enter comment and Post button. POST: Post button pressed, save comment with Id and associate with User.
/comment/:id | GET | GET: View a particular comment. Edit and Delete buttons available if User created comment. Reply button available to all.
/comment/:id?action=edit | GET, PUT | GET: Edit button pressed, open view to edit comment with Save button. PUT: Save button pressed, save edited comment.
/comment/:id?action=delete | DELETE | DELETE: Delete button pressed, delete comment
/comment/:id?action=reply | GET, POST | GET: Reply button pressed, create input box and Post button below original comment. POST: Post button pressed, save comment with Id and associate with User and original comment.
