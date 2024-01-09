const hostname = 'localhost';
const port = 3000;
const baseUrl = `http://${hostname}:${port}`;
const commentsApi = 'comments';
const commentsUrl = `${baseUrl}/${commentsApi}`;

const data = fetch(commentsUrl, {
  method: 'GET',
  accept: 'application/json',
})
  .then((comments) => {
    // populate page with comments
  })
  .catch((err) => {
    // maybe try running request again depending on error?
  });

function showComments() {
  const comments = document.getElementById('comments');
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
