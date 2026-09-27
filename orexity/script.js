/*document.querySelectorAll('.collapse-item').forEach(parent => {
  parent.addEventListener('toggle', () => {
    if (parent.open) {
      parent.querySelectorAll(':scope > .collapse-content > details')
        .forEach(d => d.open = true);
    }
  });
});*/


document.querySelectorAll('.collapse-item').forEach(function (parent) {
  parent.addEventListener('toggle', function () {
    // When the parent OPENS, close all nested tabs so only their summaries show
    if (parent.open) {
      parent.querySelectorAll('.collapse-content details').forEach(function (d) {
        d.open = false;
      });
    }
  });
});

// Inside each collapse-content: clicking any nested summary opens ALL of them
document.querySelectorAll('.collapse-content').forEach(function (content) {
  var nested = content.querySelectorAll(':scope > details');

  nested.forEach(function (d) {
    d.addEventListener('toggle', function () {
      // Only act when a nested tab is being OPENED by the user
      if (!d.open) return;

      // Open every sibling nested tab in the same content
      nested.forEach(function (other) {
        if (other !== d) other.open = true;
      });
    });
  });
})

