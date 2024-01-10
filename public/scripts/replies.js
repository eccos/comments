import { baseUrl } from '../shared/baseUrl.js';
const repliesApi = location.pathname; // /comments/:id
const repliesUrl = baseUrl + repliesApi;

const repliesElem = document.getElementById('replies');

// TODO: call on a timer to get new replies
// if new replies, show message/icon to indicate a user can refresh
// TODO: after posting reply, call to refresh replies
getReplies(); // get replies and append to screen

async function getReplies() {
  try {
    const res = await fetch(repliesUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    if (res.ok) {
      const replies = await res.json();
      repliesElem.textContent = '';
      updateDOM(replies);
    } else {
      repliesElem.textContent = 'No replies found';
    }
  } catch (err) {
    // TODO: run request again depending on error
    repliesElem.textContent = err;
  }

  function updateDOM(replies) {
    replies.forEach((reply) => {
      const container = document.createElement('div');
      const styleObj = {
        padding: '10px',
        margin: '10px',
        border: '1px solid black',
      };
      Object.assign(container.style, styleObj);

      const delBtn = document.createElement('button');
      delBtn.textContent = '🚮';
      delBtn.setAttribute('data-id', reply._id);
      delBtn.addEventListener('click', async () => {
        const resp = confirm('Delete comment permanently?');
        if (!resp) {
          return;
        }

        try {
          const res = await fetch(`/comments/${reply._id}`, {
            method: 'DELETE',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
          });
          if (res.ok) {
            alert('Comment Deleted');

            const pathParts = repliesApi.split('/');
            const parentId = pathParts[pathParts.length - 1];
            if (reply._id === parentId) {
              location.replace('/comments');
            } else {
              container.style.display = 'none';
            }
          } else {
            alert(
              `Error Deleting Comment: \nServer Status Code: ${res.status} \nServer Status Text: ${res.statusText}`
            );
          }
        } catch (err) {
          alert(`Error Deleting Comment: \n${err}`);
        }
      });
      container.appendChild(delBtn);

      const editBtn = document.createElement('button');
      editBtn.textContent = '📝';
      editBtn.setAttribute('data-id', reply._id);
      editBtn.addEventListener('click', () => {
        editBtn.style.visibility = 'hidden';

        replyElem.style.borderStyle = 'inset';
        replyElem.contentEditable = true;
        placeCaretAtEnd(replyElem);

        // TODO: add cancel and save buttons
      });
      container.appendChild(editBtn);

      const replyElem = document.createElement('div');
      replyElem.textContent = reply.text;
      container.appendChild(replyElem);

      const replyBtn = document.createElement('button');
      replyBtn.textContent = '💬';
      replyBtn.setAttribute('data-id', reply._id);
      replyBtn.addEventListener('click', () => {});
      container.appendChild(replyBtn);

      repliesElem.appendChild(container);
    });
  }
}

document.getElementById('postBtn').addEventListener('click', postReply);
async function postReply() {
  const replyText = document.getElementById('replyText');
  const postStatus = document.getElementById('postStatus');

  const text = replyText.value;

  postStatus.textContent = ''; // clear from previous func call

  if (!text) {
    postStatus.textContent = "Reply can't be empty";
    return;
  }

  const reply = { text };

  try {
    const res = await fetch(repliesUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(reply),
    });
    postStatus.innerHTML = `<strong>Server Status Code:</strong> ${res.status} <br><strong>Server Status Text:</strong> ${res.statusText}`;
  } catch (err) {
    postStatus.textContent = err;
  }
}

function placeCaretAtEnd(el) {
  el.focus();
  if (
    typeof window.getSelection != 'undefined' &&
    typeof document.createRange != 'undefined'
  ) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != 'undefined') {
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}
