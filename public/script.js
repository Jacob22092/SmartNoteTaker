document.getElementById('file-upload-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  fetch('/upload', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      document.getElementById('notes').value = data.notes;
  })
  .catch(error => console.error('Error:', error));
});

document.getElementById('copy-notes').addEventListener('click', function() {
  const notesTextarea = document.getElementById('notes');
  notesTextarea.select();
  document.execCommand('copy');
});

document.getElementById('download-notes').addEventListener('click', function() {
  const notes = document.getElementById('notes').value;
  const blob = new Blob([notes], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'notes.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('clear-notes').addEventListener('click', function() {
  document.getElementById('notes').value = '';
});
