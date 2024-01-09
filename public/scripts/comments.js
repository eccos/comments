import { baseUrl } from '../shared/baseUrl.js';
const commentsApi = 'comments';
const commentsUrl = `${baseUrl}/${commentsApi}`;

const commentsElem = document.getElementById('comments');

// TODO: call on a timer to get new comments
// if new comments, show message/icon to indicate a user can refresh
// TODO: depending on post comment logic...
// 1. after posting comment, call to refresh comments
// 2. after posting comment, redirect user to posted comment
getComments(); // get comments and append to screen

function getComments() {
  fetch(commentsUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const comments = await res.json();
        commentsElem.textContent = '';
        updateDOM(comments);
      } else {
        commentsElem.textContent = 'No comments found';
      }
    })
    .catch((err) => {
      // TODO: run request again depending on error
      commentsElem.textContent = err;
    });

  function updateDOM(comments) {
    comments.forEach((comment) => {
      const linkWrapper = document.createElement('a');
      linkWrapper.href = `${commentsApi}/${comment._id}`;

      const container = document.createElement('div');
      const styleObj = {
        padding: '10px',
        margin: '10px',
        border: '1px solid black',
      };
      Object.assign(container.style, styleObj);

      const commentElem = document.createElement('div');
      commentElem.textContent = comment.text;

      container.appendChild(commentElem);
      linkWrapper.appendChild(container);
      commentsElem.appendChild(linkWrapper);
    });
  }
}

function postComment() {
  const commentText = document.getElementById('commentText');
  const postStatus = document.getElementById('postStatus');

  const text = commentText.value;

  postStatus.textContent = ''; // clear from previous func call

  if (!text) {
    postStatus.textContent = "Comment can't be empty";
    return;
  }

  const comment = { text };

  fetch(commentsUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(comment),
  })
    .then((res) => {
      postStatus.innerHTML = `<strong>Server Status Code:</strong> ${res.status} <br><strong>Server Status Text:</strong> ${res.statusText}`;
    })
    .catch((err) => {
      postStatus.textContent = err;
    });
}
