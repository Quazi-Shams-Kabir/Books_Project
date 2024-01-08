function handler(id) {
  // Hide p, unhide input text
  document.getElementById(`review__text${id}`).classList.add("hide");
  document.getElementById(`edit__review__text${id}`).classList.remove("hide");
  // Change img buttons
  document.getElementById(`edit${id}`).classList.add("hide");
  document.getElementById(`save${id}`).classList.remove("hide");

  // Focus on textarea and Move the cursor to the end of the textarea
  var textarea = document.getElementById(`textarea${id}`);
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
}

function reverseHandler(id) {
  // revert the changes when pressing save button
  document.getElementById(`review__text${id}`).classList.remove("hide");
  document.getElementById(`edit__review__text${id}`).classList.add("hide");
  // img buttons
  document.getElementById(`edit${id}`).classList.remove("hide");
  document.getElementById(`save${id}`).classList.add("hide");

  // submitting the form;
  document.getElementById(`textarea__form${id}`).submit();
}
