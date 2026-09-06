function getData() {
  return JSON.parse(
    localStorage.getItem('askUnionData') ||
    '{"updates":[],"circulars":[],"events":[]}'
  );
}

function renderList(id, key, empty) {
  const data = getData();
  const items = data[key] || [];

  document.getElementById(id).innerHTML = items.length
    ? items.map(x => `
      <div class="item">
        <b>${x.title}</b>
        <span>${x.date}</span>
        <p>${x.details || ''}</p>
        ${x.link ? `<a href="${x.link}" target="_blank">Open PDF / Link</a>` : ''}
      </div>
    `).join('')
    : `<div class="item">${empty}</div>`;
}

renderList('updatesList', 'updates', 'No new updates published yet.');
renderList('circularsList', 'circulars', 'No circulars published yet.');
renderList('eventsList', 'events', 'No upcoming events published yet.');
