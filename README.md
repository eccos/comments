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
/comment | GET | Blank page with input box to enter comment 
/comment | POST | Save comment with new Id and associate with User
/comment/:id | GET | View a particular comment
/comment/:id | PUT | Save edited comment
/comment/:id | DELETE | Delete comment
/comment/:id | POST | Save comment with new Id and associate with User and original comment Id
